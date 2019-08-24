// General Libraries
import { Component, OnInit, Input, EventEmitter, Output, forwardRef } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { distinctUntilChanged, debounceTime, map, switchMap, tap, filter } from 'rxjs/operators';
import * as moment from 'moment';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// Services
import { ApiCaseManagerService } from './../../../../services/api-case-manager.service';
import { mulitplierValidator } from './../../../../services/consultation-form.service';
import { LoggerService } from './../../../../services/logger.service';
import { AlertService } from './../../../../services/alert.service';
import { StoreService } from './../../../../services/store.service';
import { ApiPatientVisitService } from './../../../../services/api-patient-visit.service';
import { ApiCmsManagementService } from './../../../../services/api-cms-management.service';
import { CaseChargeFormService } from './../../../../services/case-charge-form.service';
import { UtilsService } from '../../../../services/utils.service';

// Objects
import { ChargeItemDescription } from './../../../../objects/ChargeItemDescription';
import { Case } from './../../../../objects/Case';
import { DISPLAY_DATE_FORMAT, INPUT_DELAY } from '../../../../constants/app.constants';
// import { ChargeDetailsItem}  from '../../../../objects/request/PaymentCheck';
import { Uom } from '../../../../objects/Uom';
import { DrugItem, Instruction, DosageInstruction } from './../../../../objects/DrugItem';
import { DisplayDollarPipe } from './../../../../pipes/display-dollar.pipe';

@Component({
  selector: 'app-prescription-item',
  templateUrl: './prescription-item.component.html',
  styleUrls: ['./prescription-item.component.scss']
})
export class PrescriptionItemComponent implements OnInit {
  @Input() prescriptionItem: FormGroup;
  @Input() index: number;
  @Output() onDelete = new EventEmitter<number>();
  @Output() updatePrice = new EventEmitter<boolean>();
  @Output() onTopChargeItemDescriptionChanged = new EventEmitter<ChargeItemDescription>();

  loading = false;
  isCollapsed = true;
  isDiscountShown = false;

  plans = [];
  errors = [];
  baseUom = [];
  plansInSO = [];
  chargeItems = [];
  selectedItems = [];

  code;
  itemSelected;
  dosageMin = 1;
  defaultQty = 1;
  FIXED_DECIMAL = 2;
  salesUom: string = '';
  case: Case;
  price: number;
  totalPrice: FormControl;
  unitPriceDisplay: string;
  // adjustedUnitPrice: FormControl;
  adjustedUnitPriceDisplay: string;
  isServiceOrTest: boolean;

  codesTypeahead = new Subject<string>();
  topChargeItemDescription: ChargeItemDescription;
  instructions: Array<Instruction>;
  dosageInstructions: Array<DosageInstruction>;
  dosageInstruction: FormControl;
  currentDosageInstruction: string;
  dollarMask: DisplayDollarPipe;

  constructor(
    private apiCmsManagementService: ApiCmsManagementService,
    private apiPatientVisitService: ApiPatientVisitService,
    private apiCaseManagerService: ApiCaseManagerService,
    private caseChargeFormService: CaseChargeFormService,
    private store: StoreService,
    private utils: UtilsService,
    private alertService: AlertService,
    private logger: LoggerService
  ) {}

  ngOnInit() {
    console.log('prescriptionItem:', this.prescriptionItem);

    if (this.prescriptionItem.get('drugId').value !== '') {
      this.initGeneralDetails();
      this.initItemDetails();
    }

    this.subscribeChangeOnItem();

    this.setMandatoryFields();

    this.onFilterInputChanged();

    this.updatePrice.emit(true);
  }

  initItemDetails() {
    // Initialise Prices

    // Update Item Code Name, Unit Price, Adjusted Unit Prices, Item Description
    const item = this.chargeItems.find(item => {
      // console.log("pre-it item: ",item);
      return item.item.id === this.prescriptionItem.get('drugId').value;
    });

    console.log('pre-it item: ', item);

    if (item) {
      this.itemSelected = item ? item.item : [];
      this.code = this.itemSelected.code || 'Not available';

      const purchaseQty = this.prescriptionItem.get('purchaseQty').value;
      if (purchaseQty === 0 || purchaseQty === '') {
        console.log('pre-it: purchaseQty is 0');
        this.getCaseItemPrice(1);
      }

      this.salesUom = this.itemSelected.salesUom || '';

      this.topChargeItemDescription = {
        charge: this.itemSelected.name || '',
        cautionary: this.itemSelected.precautionaryInstructions || '',
        sig: (this.prescriptionItem.get('instruction').value || { instruct: '' }).instruct || '',
        remarks: this.prescriptionItem.get('remark').value || '',
        qty: this.prescriptionItem.get('purchaseQty').value || '',
        uom: this.itemSelected.salesUom || 0
      };

      this.updateTopDescription();

    }
  }

  initGeneralDetails() {
    this.topChargeItemDescription = {
      charge: '',
      cautionary: '',
      sig: '',
      remarks: '',
      qty: '',
      uom: ''
    };
    this.chargeItems = this.store.activeChargeItemList;
    this.dosageInstructions = this.store.getDosageInstructions();
    this.dosageInstruction = new FormControl();
    this.instructions = this.store.getInstructions();
    this.baseUom = this.store.uoms;


    console.log('Charge Active Items : ', this.chargeItems);

    this.getCaseDetails();
  }

  getCaseDetails() {
    if (this.store.getCaseId()) {
      this.apiCaseManagerService.searchCase(this.store.getCaseId()).subscribe(
        pagedData => {
          console.log('Search Case', pagedData);
          if (pagedData) {
            const { payload } = pagedData;
            this.populateData(payload);
          }
          return pagedData;
        },
        err => {
          this.alertService.error(JSON.stringify(err.error.message));
        }
      );
    }
  }

  populateData(data: Case) {
    // console.log('populateData: ', data);
    // this.case = data;
    // this.plansInSO = this.case.coverages;
    // if (!this.prescriptionItem.get('salesItemCode').value) {
    //   const planIds = [];
    //   this.plansInSO.forEach(element => {
    //     planIds.push(element['planId']);
    //   });
    //   this.prescriptionItem.get('excludedCoveragePlanIds').patchValue(planIds);
    // }
    this.calculateCost(this.prescriptionItem.get('purchaseQty').value);
    // this.setPlans();
  }

  setPlans() {
    const plans = this.prescriptionItem.get('excludedCoveragePlanIds').value;
    const selectedItems = [];
    if (plans) {
      this.plansInSO.forEach(element => {
        if (plans.indexOf(element['planId']) === -1) {
          selectedItems.push(element);
        }
      });
    }
    this.selectedItems = selectedItems;
  }

  calculateCost(qty) {
    let sellingPrice = this.prescriptionItem.get('unitPrice').get('price').value * 100;
    let oriTotalPrice = this.prescriptionItem.get('oriTotalPrice');
    let adjustedUnitValue = this.prescriptionItem.get('priceAdjustment').get('adjustedValue').value
      ? this.prescriptionItem.get('priceAdjustment').get('adjustedValue').value
      : 0;
    let adjustedTotalPrice = this.prescriptionItem.get('adjustedTotalPrice');
    if (qty && sellingPrice) {
      this.patchAmount(oriTotalPrice, qty, sellingPrice, false);
      this.patchAmount(adjustedTotalPrice, qty, sellingPrice + adjustedUnitValue, true);
      this.updatePrice.emit(true);
    }
  }

  adjUnitPriceFallsBelowMinimum(value) {
    console.log('unit price fell below 0.01');
    return value < 1;
  }

  patchAmount(formControl: AbstractControl, qty, price, toDollars: boolean) {
    let amount = qty * +price;
    if (toDollars) {
      amount = Number((amount / 100).toFixed(2));
    }
    formControl.patchValue(amount);
  }

  patchAdjustedUnitPrice() {
    const adjustedTotalPriceInCents = this.prescriptionItem.get('adjustedTotalPrice').value * 100;
    const adjustedAmount = this.prescriptionItem.get('priceAdjustment').get('adjustedValue');
    const qty = this.prescriptionItem.get('purchaseQty').value
      ? this.prescriptionItem.get('purchaseQty').value
      : this.defaultQty;
    let adjustedUnitPriceInCents = adjustedTotalPriceInCents / qty;

    if (this.adjUnitPriceFallsBelowMinimum(adjustedUnitPriceInCents)) {
      adjustedUnitPriceInCents = 1;
      this.patchAmount(this.prescriptionItem.get('adjustedTotalPrice'), qty, adjustedUnitPriceInCents, true);
      alert('Adj. Unit Price falls below minimum ($0.01). Readjusting Total Amount');
    }

    // this.adjustedUnitPrice.patchValue(adjustedUnitPriceInCents);
    this.adjustedUnitPriceDisplay = (adjustedUnitPriceInCents / 100).toFixed(2);

    let adjustedAmountInCents = (adjustedTotalPriceInCents - this.prescriptionItem.get('oriTotalPrice').value) / qty;
    adjustedAmount.patchValue(adjustedAmountInCents);

    this.updatePrice.emit(true);
  }

  onItemDeSelect(item: any) {
    let plans = this.prescriptionItem.get('excludedCoveragePlanIds').value;
    plans.push(item['value']['planId']);
  }

  onClear() {
    const plans = this.prescriptionItem.get('excludedCoveragePlanIds').value;
    plans.splice(0);
    this.plansInSO.forEach(element => {
      plans.push(element['planId']);
    });
  }

  subscribeChangeOnItem() {
    // Main Form Changes for Copy Prescription

    this.prescriptionItem.valueChanges.pipe(debounceTime(INPUT_DELAY)).subscribe(data => {
      if (!this.prescriptionItem.valid && this.isCollapsed) {
        this.rowClicked();
      }
    });

    this.prescriptionItem.valueChanges
      .pipe(
        debounceTime(INPUT_DELAY),
        distinctUntilChanged((a, b) => {
          return a.id === b.id;
        })
      )
      .subscribe(data => {
        console.log('new Form Group inserted', data);
        // Retrieve price
        this.updatePrice.emit(true);
        // this.fillItemValues(data);
        this.updateInventories();
      });

    // Instruction Changes
    this.prescriptionItem
      .get('instruction')
      .get('code')
      .valueChanges.pipe(debounceTime(INPUT_DELAY))
      .subscribe(data => {
        this.updateInstructionToTopDescription(this.prescriptionItem.get('instruction').value);
      });

    // Quantity Changes
    this.prescriptionItem
      .get('dose')
      .get('uom')
      .valueChanges.pipe(
        debounceTime(INPUT_DELAY),
        distinctUntilChanged((a, b) => {
          return a === b;
        })
      )
      .subscribe(data => {
        this.topChargeItemDescription.uom = data;
        this.updateTopDescription();
      });

    // Dosage Instruction Quantity Changes
    this.prescriptionItem
      .get('dose')
      .get('quantity')
      .valueChanges.pipe(
        debounceTime(INPUT_DELAY),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.patchDosageInstruction();
      });

    this.prescriptionItem
      .get('purchaseQty')
      .valueChanges.pipe(debounceTime(INPUT_DELAY))
      .subscribe(data => {
        let qty = data;
        if (data) {
          this.topChargeItemDescription.qty = qty;
          // this.adjustedUnitPrice.patchValue(0);
          this.calculateCost(qty);
          this.updateInventories();
        }
      });

    // Dosage Instruction Changes
    this.prescriptionItem
      .get('dosageInstruction')
      .get('code')
      .valueChanges.pipe(
        debounceTime(INPUT_DELAY),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.updateDosageInstructionToTopDescription(
          this.prescriptionItem.get('dosageInstruction').get('instruct').value
        );
        if (
          this.prescriptionItem
            .get('dosageInstruction')
            .get('instruct')
            .value.includes('#')
        ) {
          this.setDosageValidators();
          this.patchDosageInstruction();
        } else {
          this.prescriptionItem
            .get('dose')
            .get('quantity')
            .setValidators(null);
          this.prescriptionItem
            .get('dose')
            .get('quantity')
            .markAsTouched();
          this.prescriptionItem
            .get('dose')
            .get('quantity')
            .updateValueAndValidity();
        }
      });

    // Duration Changes
    this.prescriptionItem
      .get('duration')
      .valueChanges.pipe(debounceTime(INPUT_DELAY))
      .subscribe(data => {
        console.log('duration', data);
      });

    // convert correct date format
    this.prescriptionItem
      .get('expiryDate')
      .valueChanges.pipe(
        map(d => {
          d = moment(d, DISPLAY_DATE_FORMAT).format(DISPLAY_DATE_FORMAT);
          const isValid = moment(d, DISPLAY_DATE_FORMAT).isValid();
          return isValid ? d : '';
        })
      )
      .subscribe(data => {
        this.prescriptionItem.get('expiryDate').patchValue(data, { emitEvent: false });
      });

    // Remark Changes
    this.prescriptionItem
      .get('remark')
      .valueChanges.pipe(
        debounceTime(INPUT_DELAY),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.updateRemarkToTopDescription(value);
      });

    this.prescriptionItem
      .get('adjustedTotalPrice')
      .valueChanges.pipe(
        debounceTime(INPUT_DELAY),
        distinctUntilChanged()
      )
      .subscribe(valueInDollars => {
        // let valueInCents = valueInDollars * 100;
        if (valueInDollars && valueInDollars !== 0) {
          this.patchAdjustedUnitPrice();
        } else {
          this.prescriptionItem.get('adjustedTotalPrice').patchValue(0);
        }
      });
  }

  onDosageInstructionSelect(option) {
    if (option) {
      console.log('Dosage Instruction', option);
      // this variable to store the original instruction and to be used in case replacement is needed
      this.currentDosageInstruction = option.instruct;
      const dosageInstruct = this.prescriptionItem.get('dosageInstruction').get('instruct');

      dosageInstruct.patchValue(option.instruct);
    }
  }

  onInstructionSelect(option) {
    this.prescriptionItem.get('instruction').patchValue(option);
    console.log('instruction option', option);

    this.updateInstructionToTopDescription(option);
  }
  /** ng-select change detection */

  resetFields(option: any) {
    this.prescriptionItem.get('drugId').patchValue(option.id);
    this.prescriptionItem.get('expiryDate').patchValue(this.utils.getDBDateOnly(''));
    this.prescriptionItem
      .get('instruction')
      .get('code')
      .patchValue('');
    this.prescriptionItem
      .get('instruction')
      .get('instruct')
      .patchValue('');
    this.prescriptionItem.get('duration').patchValue('');
    this.prescriptionItem
      .get('dosageInstruction')
      .get('code')
      .patchValue('');
    this.prescriptionItem
      .get('dosageInstruction')
      .get('instruct')
      .patchValue('');
    // Inventory values reset
    this.prescriptionItem.patchValue({
      batchNumber: '',
      expiryDate: '',
      stock: 9999
    });
  }

  getCaseItemPrice(qty) {
    let excludedPlans = this.prescriptionItem.get('excludedCoveragePlanIds').value;

    if (this.itemSelected) {
      const caseItem = {
        chargeDetails: [this.caseChargeFormService.buildChargeDetailsItem(this.itemSelected.id, excludedPlans, qty)]
      };
      this.apiCaseManagerService.getCaseItemPrices(this.store.getCaseId(), caseItem).subscribe(
        data => {
          var caseItems = data.payload.chargeDetails;
          var caseItem = caseItems.find(data => {
            return data.itemId === this.itemSelected.id;
          });
          if (caseItem) {
            let price = caseItem.charge.price;
            this.prescriptionItem
              .get('unitPrice')
              .get('price')
              .patchValue(price / 100);
            this.unitPriceDisplay = (price / 100).toFixed(2);
            this.calculateCost(qty);
            this.updatePrice.emit(true);
          }
        },
        err => {
          this.alertService.error(JSON.stringify(err.error.message));
        }
      );
    }
  }

  patchQuantity() {
    console.log('presctiptionItem', this.prescriptionItem);
  }

  populateDosageInstruction(data) {
    if (data.dosageInstruction) {
      this.currentDosageInstruction = data.dosageInstruction.instruct;
      this.prescriptionItem.get('dosageInstruction').patchValue(data.dosageInstruction);
    } else {
      this.currentDosageInstruction = '';
      this.prescriptionItem
        .get('dosageInstruction')
        .get('code')
        .patchValue('');
      this.prescriptionItem
        .get('dosageInstruction')
        .get('instruct')
        .patchValue('');
    }
  }

  populateInstruction(data) {
    if (data.instruction) {
      this.prescriptionItem.get('instruction').patchValue(data.instruction);
    }
  }

  /** DISCOUNT */
  toggleDiscount() {
    this.isDiscountShown = !this.isDiscountShown;
  }

  amountChanged(event: any) {
    console.log('amount changed: ', event);
  }
  /** DISCOUNT */

  patchDosageInstruction() {
    if (
      this.prescriptionItem
        .get('dosageInstruction')
        .get('instruct')
        .value.includes('#')
    ) {
      const instruct = this.prescriptionItem.get('dose').get('quantity').value
        ? this.prescriptionItem
            .get('dosageInstruction')
            .get('instruct')
            .value.replace('#', this.prescriptionItem.get('dose').get('quantity').value)
        : this.currentDosageInstruction;
      this.updateDosageInstructionToTopDescription(instruct);
    }
  }

  updateTopDescription() {
    console.log('emit touch');
    this.onTopChargeItemDescriptionChanged.emit(this.topChargeItemDescription);
  }

  updateDrugToTopDescription(chargeItem) {
    console.log('pre-it this charge item description: ', this.topChargeItemDescription);
    this.topChargeItemDescription.charge = chargeItem['name'] || '';
    this.topChargeItemDescription.uom = chargeItem['salesUom'] || '';
    this.updateTopDescription();
  }

  updateDosageInstructionToTopDescription(dosageInstruction) {
    if (dosageInstruction) {
      this.topChargeItemDescription.dosageInstruction = dosageInstruction + '/';
    } else {
      this.topChargeItemDescription.dosageInstruction = '';
    }
    this.updateTopDescription();
  }

  updateCautionariesToTopDescription(chargeItem) {
    this.topChargeItemDescription.cautionary = chargeItem['precautionaryInstructions'];
    this.updateTopDescription();
  }

  updateInstructionToTopDescription(chargeItem) {
    const item = this.instructions ? this.instructions.filter(x => x.code === chargeItem.code) : [];
    if (item[0]) {
      this.topChargeItemDescription.sig = item[0]['instruct'];
      this.updateTopDescription();
    }
  }

  updateRemarkToTopDescription(remark) {
    this.topChargeItemDescription.remarks = remark;
    this.updateTopDescription();
  }

  deletePressed() {
    console.log('emit delete', this.index);
    this.onDelete.emit(this.index);
  }

  onFilterInputChanged() {
    try {
      this.codesTypeahead
        .pipe(
          filter(input => {
            if (input.trim().length === 0) {
              this.logger.info('input is 0');
              // this.drugs = this.store.drugList;
              return false;
            } else {
              return true;
            }
          }),
          distinctUntilChanged((a, b) => {
            this.logger.info('input is 1');
            return a === b;
          }),
          tap(() => (this.loading = true)),
          debounceTime(200),
          switchMap((term: string) => {
            return this.apiCmsManagementService.searchDrugs(term);
          })
        )
        .subscribe(
          data => {
            this.loading = false;
            console.log('DATA', data);

            if (data) {
              // this.drugs = data.payload;
            }
          },
          err => {
            this.loading = false;
            this.alertService.error(JSON.stringify(err.error.message));
          }
        );
    } catch (err) {
      console.log('Search Diagnosis Error', err);
    }
  }

  disableFields() {
    if (this.isService()) {
      this.prescriptionItem
        .get('instruction')
        .get('code')
        .disable();
      this.prescriptionItem
        .get('dose')
        .get('uom')
        .disable();
      this.prescriptionItem
        .get('dose')
        .get('quantity')
        .disable();
      this.prescriptionItem.get('duration').disable();
    } else {
      // this.isServiceOrTest = false;
    }
  }

  isService() {
    console.log('#001 itemSelected:', this.itemSelected);
    if (this.itemSelected) {
      const itemType = this.itemSelected.itemType;
      if (itemType === 'LABORATORY' || itemType === 'SERVICE') {
        return true;
      } else {
        return false;
      }
    }
  }

  setMandatoryFields() {
    if (!this.isService()) {
      console.log('set mandatory');
      this.prescriptionItem
        .get('instruction')
        .get('code')
        .setValidators([Validators.required]);
      this.prescriptionItem
        .get('instruction')
        .get('code')
        .markAsTouched({ onlySelf: true });
      this.prescriptionItem
        .get('instruction')
        .get('code')
        .updateValueAndValidity();
      this.prescriptionItem.get('purchaseQty').setValidators([Validators.required, Validators.min(1)]);
      this.prescriptionItem.get('purchaseQty').markAsTouched({ onlySelf: true });
      this.prescriptionItem.get('purchaseQty').updateValueAndValidity();

      this.setDosageValidators();

      this.prescriptionItem
        .get('expiryDate')
        .setValidators([Validators.required, Validators.pattern('((0[1-9]|[12]\\d|3[01])-(0[1-9]|1[0-2])-\\d{4})')]);
      this.prescriptionItem.get('expiryDate').markAsTouched({ onlySelf: true });
      this.prescriptionItem.get('expiryDate').updateValueAndValidity();
    }
  }

  setDosageValidators() {
    const uomInput = this.prescriptionItem
      .get('dose')
      .get('uom')
      .value.toLocaleLowerCase();

    const uom: Uom = this.store.uoms.find(item => item.uom.toLowerCase() === uomInput) || new Uom();
    this.dosageMin = uom.multiply;

    this.prescriptionItem
      .get('dose')
      .get('quantity')
      .setValidators([Validators.required, Validators.min(this.dosageMin), mulitplierValidator(this.dosageMin)]);
    this.prescriptionItem
      .get('dose')
      .get('quantity')
      .markAsTouched({ onlySelf: true });
    this.prescriptionItem
      .get('dose')
      .get('quantity')
      .updateValueAndValidity();
  }

  updateInventories() {
    console.log('**** updateInventories ****');

    const drugId = this.prescriptionItem.get('drugId').value;
    const quantity = this.prescriptionItem.get('purchaseQty').value;

    const drugUsage = {
      inventoryType: 'DRUG',
      itemId: drugId,
      quantity: quantity
    };
    this.apiPatientVisitService.getInventory(this.store.getClinicId(), [drugUsage]).subscribe(
      res => {
        const inventories = res.payload;
        const inventory = inventories.find(iv => iv.itemId === drugId);

        const batchNo = inventory.batchNo ? inventory.batchNo : '';
        const stock = inventory.remainingQuantity ? inventory.remainingQuantity : 9999;
        const isDateValid = moment(inventory.expiryDate, DISPLAY_DATE_FORMAT).isValid();
        const expiryDate = isDateValid
          ? moment(inventory.expiryDate, 'YYYY-MM-DD').format(DISPLAY_DATE_FORMAT)
          : moment(new Date()).format(DISPLAY_DATE_FORMAT);

        // Inventory Invalid msg will be shown if any field is mising
        const inventoryInvalid = batchNo && expiryDate && stock ? '' : 'The inventory data may not be correct.';
        this.prescriptionItem.patchValue({
          batchNumber: batchNo || '',
          expiryDate: expiryDate || moment(new Date()).format(DISPLAY_DATE_FORMAT),
          stock,
          inventoryInvalid
        });
      },
      err => {
        this.prescriptionItem.patchValue({
          // batchNumber: 'N/A',
          batchNumber: '',
          expiryDate: moment(new Date()).format(DISPLAY_DATE_FORMAT),
          stock: 9999,
          inventoryInvalid: 'The item is not available in the inventory.'
        });
      }
    );
  }

  rowClicked() {
    this.isCollapsed = !this.isCollapsed;

    if (!this.isCollapsed) {
      if (!this.prescriptionItem.touched) {
        this.fillItemValues(this.itemSelected);
      }
    }

    this.updateTopDescription();
  }

  fillItemValues(data) {
    console.log('fillItemValues');
    const drugId = data.id;
    if (drugId) {
      this.apiCmsManagementService.searchListItem(drugId).subscribe(
        pagedData => {
          if (pagedData) {
            let chargeItemDetail = pagedData['payload'].item;
            console.log('chargeItemDetail: ', chargeItemDetail);
            this.salesUom = chargeItemDetail.salesUom;
            this.prescriptionItem.get('drugId').patchValue(chargeItemDetail['id']);

            if(this.salesUom){
              this.prescriptionItem
                .get('dose')
                .get('uom')
                .patchValue(this.salesUom);
            }
            this.prescriptionItem
              .get('instruction')
              .get('code')
              .patchValue(chargeItemDetail['frequencyCode']);
            // this.prescriptionItem.get('duration').patchValue(chargeItemDetail['frequency']);
            if (
              this.prescriptionItem.get('purchaseQty').value === '' ||
              this.prescriptionItem.get('purchaseQty').value === 0
            ) {
              this.prescriptionItem.get('purchaseQty').patchValue(this.defaultQty);
            }
            this.updateDrugToTopDescription(chargeItemDetail);
            this.updateCautionariesToTopDescription(chargeItemDetail);
            this.getCaseItemPrice(this.prescriptionItem.get('purchaseQty').value);

            this.setMandatoryFields();
            this.disableFields();
          }
          return pagedData;
        },
        err => {
          this.alertService.error(JSON.stringify(err.error.message));
        }
      );
    }
  }
}
