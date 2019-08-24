import { DosageInstruction } from './../../../../objects/DrugItem';
import { Uom} from './../../../../objects/Uom';
import { CaseChargeFormService } from './../../../../services/case-charge-form.service';
import { ApiPatientVisitService } from './../../../../services/api-patient-visit.service';
import { map, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { StoreService } from '../../../../services/store.service';
import { DISPLAY_DATE_FORMAT, INPUT_DELAY } from '../../../../constants/app.constants';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { ChargeItemDescription } from '../../../../objects/ChargeItemDescription';
import { ApiCaseManagerService } from '../../../../services/api-case-manager.service';
import { AlertService } from '../../../../services/alert.service';
import { ApiCmsManagementService } from '../../../../services/api-cms-management.service';
import { Case } from '../../../../objects/Case';
import PaymentCheck from '../../../../objects/request/PaymentCheck';
import { mulitplierValidator } from './../../../../services/consultation-form.service';

@Component({
  selector: 'app-case-charge-item',
  templateUrl: './case-charge-item.component.html',
  styleUrls: ['./case-charge-item.component.scss']
})
export class CaseChargeItemComponent implements OnInit {
  @Input() prescriptionItem: FormGroup;
  @Input() index: number;
  @Input() isAllCheck: boolean;
  @Output() onTopChargeItemDescriptionChanged = new EventEmitter<ChargeItemDescription>();
  @Output() onHandleChargeItemChange = new EventEmitter<any>();

  dosageMin = 1;
  loading = false;
  defaultQty = 1;
  chargeItems = [];
  plansInSO = [];
  instructions = [];
  baseUom = [];
  selectedItems = [];
  topChargeItemDescription: ChargeItemDescription;
  dosageInstructions: Array<DosageInstruction>;
  dosageInstruction: FormControl;
  adjustedUnitPrice: FormControl;
  codesTypeahead = new Subject<string>();
  currentDosageInstruction: string;
  totalPrice: number;
  case: Case;
  itemSelected;
  isDiscountShown = false;
  minDate: Date;
  unitPriceDisplay: string;
  adjustedUnitPriceDisplay: string;
  dataFromConsult = false;
  batchNoArr = []
  expiryDateArr = []
  inventoryData = []
  needToFillValues = false;
  private onQtyChange: Subject<string> = new Subject();

  constructor(
    private store: StoreService, private fb: FormBuilder,
    private apiCaseManagerService: ApiCaseManagerService,
    private alertService: AlertService,
    private apiCmsManagementService: ApiCmsManagementService,
    private caseChargeFormService: CaseChargeFormService
  ) { }

  ngOnInit() {
    console.log("prescriptionItem", this.prescriptionItem)
    this.getChargeItems();
    this.initItemDetails();
    this.subscribeChange();
    this.getCaseDetails();
  }

  initItemDetails() {
    this.minDate = new Date();
    this.adjustedUnitPrice = new FormControl();
    this.topChargeItemDescription = { charge: '', cautionary: '', sig: '', remarks: '' };
    this.instructions = this.store.getInstructions();
    this.dosageInstructions = this.store.getDosageInstructions();
    this.dosageInstruction = new FormControl();
    this.baseUom = this.store.uoms;
    const tempItem = this.chargeItems.find(item => {
      return item.id === this.prescriptionItem.get('drugId').value
    });

    if (tempItem) {
      console.log("tempItem: ",tempItem);
      this.itemSelected = tempItem ? tempItem.item : [];
      if (
        this.prescriptionItem.get('purchaseQty').value === 0 ||
        this.prescriptionItem.get('purchaseQty').value === ''
      ) {
        this.getCaseItemPrice(1);
      } else {
        this.getCaseItemPrice(this.prescriptionItem.get('purchaseQty').value);
      }

      // console.log("item selected: ",this.itemSelected);
      this.fillItemValuesFromConsult(this.prescriptionItem.get('drugId').value);
      this.disableFields()
      this.setMandatoryFields()
    }
    this.prescriptionItem.value['purchasedId'] ? this.needToFillValues = false : this.needToFillValues = true
    this.getChargeItems();
    this.getCaseDetails();
    this.subscribeChange();
  }

  onKeyUp() {
    this.onHandleChargeItemChange.emit({});
    // this.onQtyChange.next(qtyValue);
  }

  onItemSelect(item: any) {
    let plans = this.prescriptionItem.get('excludedCoveragePlanIds').value
    if (item) {
      const index: number = plans.indexOf(item['planId']);
      if (index !== -1) {
        plans.splice(index, 1);
      }
    }
    console.log("plan Selected", this.prescriptionItem.get('excludedCoveragePlanIds').value);
    this.onHandleChargeItemChange.emit({});
  }

  onItemDeSelect(item: any) {
    let plans = this.prescriptionItem.get('excludedCoveragePlanIds').value
    plans.push(item['value']['planId'])
    console.log("plan deSelected", this.prescriptionItem.get('excludedCoveragePlanIds').value);
    this.onHandleChargeItemChange.emit({});
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

  onClear() {
    let plans = this.prescriptionItem.get('excludedCoveragePlanIds').value
    plans.splice(0)
    this.plansInSO.forEach(element => {
      plans.push(element['planId'])
    });
    console.log("plan clear", this.prescriptionItem.get('excludedCoveragePlanIds').value);
    this.onHandleChargeItemChange.emit({});
  }

  subscribeChange() {
    this.prescriptionItem.valueChanges.pipe(debounceTime(INPUT_DELAY), distinctUntilChanged((a, b) => {
      return a.drugId === b.drugId;
    })).subscribe(data => {
      if (this.needToFillValues) {
        console.log("Auto fill values", this.needToFillValues)
        this.fillItemValues(data);
      } else {
        console.log("Auto fill values", this.needToFillValues)
        this.needToFillValues = true;
      }
    });
    this.prescriptionItem.get('instruction').get('code').valueChanges.pipe(debounceTime(INPUT_DELAY)).subscribe(data => {
      this.updateInstructionToTopDescription(this.prescriptionItem.get('instruction').value);
    });
    this.prescriptionItem.get('dose').get('uom').valueChanges.pipe(debounceTime(INPUT_DELAY)).subscribe(data => {
      this.topChargeItemDescription.uom = data;
      this.updateTopDescription();
    });
    this.prescriptionItem.get('dose').get('quantity').valueChanges.pipe(debounceTime(INPUT_DELAY)).subscribe(data => {
      this.patchDosageInstruction();
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
        console.log("value: ",value);
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

    this.prescriptionItem.get('purchaseQty').valueChanges.pipe(debounceTime(INPUT_DELAY)).subscribe(data => {

      let qty = data;
      if (data === 0 || data === '' || data === null) {
        qty = this.defaultQty;
        this.prescriptionItem.get('purchaseQty').patchValue(qty);
      }
      this.topChargeItemDescription.qty = data;
      this.calculateCost(data);
    });
    this.prescriptionItem.get('duration').valueChanges.pipe(debounceTime(INPUT_DELAY)).subscribe(data => {
      this.updateTopDescription();
    });
    this.prescriptionItem.get('expiryDate').valueChanges.pipe(map(d => {
      d = moment(d, DISPLAY_DATE_FORMAT).format(DISPLAY_DATE_FORMAT);
      const isValid = moment(d, DISPLAY_DATE_FORMAT).isValid();
      return isValid ? d : '';
    })).subscribe(data => {
      this.prescriptionItem.get('expiryDate').patchValue(data, { emitEvent: false });
    });
    this.prescriptionItem.get('remark').valueChanges.pipe(debounceTime(INPUT_DELAY), distinctUntilChanged()).subscribe(value => {
      this.updateRemarkToTopDescription(value);
    });

    this.prescriptionItem
      .get('adjustedTotalPrice')
      .valueChanges.pipe(
        debounceTime(INPUT_DELAY),
        distinctUntilChanged()
      )
      .subscribe(valueInDollars => {
        if (valueInDollars && valueInDollars !== 0) {
          this.patchAdjustedUnitPrice();
        } else {
          this.prescriptionItem
            .get('adjustedTotalPrice').patchValue(0)
        }
        this.onHandleChargeItemChange.emit({});
      });
    this.prescriptionItem.get('batchNumber').valueChanges.pipe(debounceTime(INPUT_DELAY)).subscribe(data => {
      this.changeExpiryDate(data)
    });
  }

  fillItemValues(data) {
    // let drugId = data['drugId']
        let drugId = data;

    if (drugId) {
      let chargeItemDetail = this.chargeItems.filter(x => x.id === drugId)[0]
      console.log("chargeItemDetail: ", chargeItemDetail);
      this.prescriptionItem.get('drugId').patchValue(chargeItemDetail['id']);
      this.prescriptionItem.get('dose').get('uom').patchValue(chargeItemDetail['baseUom']);
      this.prescriptionItem.get('instruction').get('code').patchValue(chargeItemDetail['frequencyCode']);
      this.prescriptionItem.get('unitPrice').get('price').patchValue(chargeItemDetail['sellingPrice']['price']);
      this.prescriptionItem.get('unitPrice').get('taxIncluded').patchValue(chargeItemDetail['sellingPrice']['taxIncluded']);
      this.prescriptionItem.get('cost').get('price').patchValue(chargeItemDetail['cost']['price'] / 100);
      this.prescriptionItem.get('cost').get('taxIncluded').patchValue(chargeItemDetail['cost']['taxIncluded']);
      this.prescriptionItem.get('duration').patchValue(chargeItemDetail['frequency']);
      this.calculateCost(this.prescriptionItem.get('purchaseQty').value)
      this.updateDrugToTopDescription(chargeItemDetail)
      this.updateCautionariesToTopDescription(chargeItemDetail)
      this.updateRemarkToTopDescription(this.prescriptionItem.get('remark').value);
      if (!this.prescriptionItem.get('purchaseQty').value)
        this.handleChargeItemChange()
    }
  }

  fillItemValuesFromConsult(data) {
    let drugId = data;
    if (drugId) {
      let chargeItemDetail = this.chargeItems.filter(x => x.id === drugId)[0]
      console.log("chargeItemDetail: ", chargeItemDetail);
      // this.prescriptionItem.get('drugId').patchValue(chargeItemDetail['id']);
      this.updateDrugToTopDescription(chargeItemDetail)
      this.updateCautionariesToTopDescription(chargeItemDetail)
      this.updateRemarkToTopDescription(this.prescriptionItem.get('remark').value);
      this.getCaseItemPrice(this.prescriptionItem.get('purchaseQty').value);
      // this.disableFields();
      // this.setMandatoryFields();
    }
  }

  calculateCost(qty) {
    console.log("calculating Cost: ", this.prescriptionItem);
    let sellingPrice = this.prescriptionItem.get('unitPrice').get('price').value * 100;
    let oriTotalPrice = this.prescriptionItem.get('oriTotalPrice');
    let adjustedTotalPrice = this.prescriptionItem.get('adjustedTotalPrice');
    let adjustedUnitValue = this.prescriptionItem.get('priceAdjustment').get('adjustedValue').value ?
      this.prescriptionItem.get('priceAdjustment').get('adjustedValue').value : 0; if (qty && sellingPrice) {
        if (qty && sellingPrice) {
          this.patchAmount(oriTotalPrice, qty, sellingPrice, false);
          this.patchAmount(adjustedTotalPrice, qty, (sellingPrice + adjustedUnitValue), true);
          // this.updatePrice.emit(true);

        }
      }
      console.log("calculating Cost: ", this.prescriptionItem);

  }

  adjUnitPriceFallsBelowMinimum(value) {
    console.log('unit price fell below 0.01');
    return value < 1;
  }

  patchAmount(formControl: AbstractControl, qty, price, toDollars: boolean) {
    let amount = qty * + price;
    if (toDollars) {
      amount = Number((amount / 100).toFixed(2));
    }
    console.log("toDollars: ", toDollars);
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
      alert("Adj. Unit Price falls below minimum ($0.01). Readjusting Total Amount");
    }
    this.adjustedUnitPriceDisplay = (adjustedUnitPriceInCents / 100).toFixed(2);

    let adjustedAmountInCents = (adjustedTotalPriceInCents - this.prescriptionItem.get('oriTotalPrice').value) / qty;
    adjustedAmount.patchValue(adjustedAmountInCents);
  }

  calculateAdjustedAmount() {
    let adjustedTotalPrice = this.prescriptionItem.get('adjustedTotalPrice').value * 100;
    let adjustedAmount = this.prescriptionItem.get('priceAdjustment').get('adjustedValue');
    let qty = this.prescriptionItem.get('purchaseQty').value;

    adjustedAmount.patchValue((adjustedTotalPrice - this.prescriptionItem.get('oriTotalPrice').value) / qty);
    this.onHandleChargeItemChange.emit({});
  }

  getCaseItemPrice(qty) {
    let excludedPlans = [];
    if (this.itemSelected || this.prescriptionItem.get('drugId').value) {
      console.log("#0003 Calculating Case Item Price: ");
      const caseItem = { chargeDetails: [this.caseChargeFormService.buildChargeDetailsItem(this.prescriptionItem.get('drugId').value, excludedPlans, qty)] };
      this.apiCaseManagerService.getCaseItemPrices(this.store.getCaseId(), caseItem).subscribe(
        data => {
          console.log("#0003 ccase Item Price: ",data);

          var caseItems = data.payload.chargeDetails;
          var caseItem = caseItems.find(data => {
            return data.itemId === this.prescriptionItem.get('drugId').value;
          });
          if (caseItem) {
            // const charge = value.charge.price;
            const price = caseItem.charge.price;
            this.prescriptionItem.get('unitPrice').get('price').patchValue(price / 100);
            this.unitPriceDisplay = (price / 100).toFixed(2);
            console.log("#0003 Unit Price display: ",this.unitPriceDisplay);

            this.calculateCost(qty);
          }
        },
        err => {
          this.alertService.error(JSON.stringify(err.error.message));
        });
    let sellingPrice = this.prescriptionItem.get('unitPrice').get('price').value
    if (qty && sellingPrice) {
      console.log('Calculating price', qty, 'x', sellingPrice);
      this.prescriptionItem.get('originalTotalPrice').patchValue((qty * +sellingPrice)/100)
    }
  }
  }

  getCaseDetails() {
    if (this.store.getCaseId) {
      this.apiCaseManagerService.searchCase(this.store.getCaseId()).subscribe(pagedData => {
        console.log('Search Case', pagedData);
        if (pagedData) {
          const { payload } = pagedData;
          this.populateData(payload);
        }
        return pagedData;
      },
        err => {
          this.alertService.error(JSON.stringify(err.error.message));
        });
    }
  }

  getChargeItems() {
    this.store.activeChargeItemList.forEach(element => {
      this.chargeItems.push(element['item'])
    });

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

  disableFields() {
    if (this.isService()) {
      this.prescriptionItem
        .get('instruction')
        .get('code').reset();
      this.prescriptionItem
        .get('instruction')
        .get('code')
        .disable();
      this.prescriptionItem
        .get('dose')
        .get('uom')
        .reset();
      this.prescriptionItem
        .get('dose')
        .get('uom')
        .disable();
      this.prescriptionItem
        .get('dose')
        .get('quantity')
        .reset();
      this.prescriptionItem
        .get('dose')
        .get('quantity')
        .disable();
      this.prescriptionItem
        .get('duration')
        .reset();
      this.prescriptionItem
        .get('duration')
        .disable();
    }
  }

  isService() {
    if (this.itemSelected) {
      console.log("isservice: ", this.itemSelected.itemType);
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
        .markAsTouched();
      this.prescriptionItem
        .get('instruction')
        .get('code')
        .updateValueAndValidity();
      this.prescriptionItem.get('purchaseQty').setValidators([Validators.required, Validators.min(1)]);
      this.prescriptionItem.get('purchaseQty').markAsTouched();
      this.prescriptionItem.get('purchaseQty').updateValueAndValidity();

      this.setDosageValidators();

      this.prescriptionItem
        .get('expiryDate')
        .setValidators([Validators.required, Validators.pattern('((0[1-9]|[12]\\d|3[01])-(0[1-9]|1[0-2])-\\d{4})')]);
      this.prescriptionItem.get('expiryDate').markAsTouched();
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
      .markAsTouched();
    this.prescriptionItem
      .get('dose')
      .get('quantity')
      .updateValueAndValidity();
  }

  populateData(data: Case) {
    this.case = data;
    this.plansInSO = this.case.coverages;
    // if (!(this.prescriptionItem.get('salesItemCode') && this.prescriptionItem.get('salesItemCode').value)) {
    //   let planIds = []
    //   this.plansInSO.forEach(element => {
    //     planIds.push(element['planId'])
    //   });
    //   this.prescriptionItem.get('excludedCoveragePlanIds').patchValue(planIds)
    // }
    if (!this.prescriptionItem.get('purchasedId').value) {
      let planIds = []
      this.plansInSO.forEach(element => {
        planIds.push(element['planId'])
      });
      this.prescriptionItem.get('excludedCoveragePlanIds').patchValue(planIds)
    }
    this.setPlans()
  }

  setPlans() {
    let plans = this.prescriptionItem.get('excludedCoveragePlanIds').value;
    let selectedItems = [];
    this.plansInSO.forEach(element => {
      if (!plans || (plans && plans.indexOf(element['planId']) === -1)) {
        selectedItems.push(element);
      }
    });
    console.log("selected plans ", selectedItems);
    this.selectedItems = selectedItems
  }

  updateDrugToTopDescription(chargeItem) {
    this.topChargeItemDescription.charge = chargeItem['name']
    this.topChargeItemDescription.uom = chargeItem['baseUom']
    this.updateTopDescription();
  }

  // updateDosageInstructionToTopDescription(chargeItem) {
  //   this.topChargeItemDescription.sig = chargeItem['indications'];
  //   this.updateTopDescription();
  // }

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
    let item = this.instructions.filter(x => x.code === chargeItem.code)
    if (item[0]) {
      this.topChargeItemDescription.sig = item[0]['instruct'];
      this.updateTopDescription();
    }
  }

  updateRemarkToTopDescription(remark) {
    this.topChargeItemDescription.remarks = remark;
    this.updateTopDescription();
  }

  updateTopDescription() {
    this.onTopChargeItemDescriptionChanged.emit(this.topChargeItemDescription);
  }

  toggleDiscount() {
    this.isDiscountShown = !this.isDiscountShown;
  }

  handleChargeItemChange() {
    const tempItem = {
      itemId: this.prescriptionItem.get('drugId').value,
      excludePlanIds: this.prescriptionItem.get('excludedCoveragePlanIds').value,
      purchasedId: 0
    }
    let itemArr = []
    itemArr.push(tempItem)
    this.apiCaseManagerService.getInvoicesUpdates(this.store.getCaseId(), itemArr).subscribe(data => {
      if (data.statusCode === 'S0000') {
        const { payload } = data;
        this.updateChargeBreackdown(payload);
      }
      else
        alert(data.message);
    },
      err => {
        if (err.error)
          this.alertService.error(JSON.stringify(err.error.message));
      });
  }

  updateChargeBreackdown(payload) {

    payload['itemPrices'].forEach(element => {
      this.inventoryData = element['inventoryData']
      this.prescriptionItem.get('unitPrice').get('price').patchValue((Number(element['unitPrice']) + Number(element['gstAmount'])))
      this.calculateCost(this.prescriptionItem.get('purchaseQty').value)
    })
    this.prescriptionItem.get('batchNumber').patchValue(this.inventoryData[0]['batchNo'])
    this.prescriptionItem.get('expiryDate').patchValue(this.inventoryData[0]['expireDate'])
  }

  addNewExpiryDate = (term) => {
    return {batchNo: '', expireDate: term}
  }

  addNewBatchNo = (term) => {
    return {batchNo: term, expireDate: ''}
  }

  changeExpiryDate(data) {
    let selectedInventoryItem = this.inventoryData.filter(x => x.batchNo === data)
    if(selectedInventoryItem.length > 0)
      this.prescriptionItem.get('expiryDate').patchValue(selectedInventoryItem[0]['expireDate'])
  }
}
