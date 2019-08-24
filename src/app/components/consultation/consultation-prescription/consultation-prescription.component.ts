import { ChargeItemDescription } from './../../../objects/ChargeItemDescription';
import { CaseChargeFormService } from './../../../services/case-charge-form.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ConsultationSearchComponent } from './consultation-search/consultation-search.component';
import { BsModalService } from 'ngx-bootstrap';
import { DrugItem, DosageInstruction } from './../../../objects/DrugItem';
import { Subject } from 'rxjs';
import { FormArray, FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { TopDrugDescription } from '../../../objects/DrugDescription';
import { StoreService } from '../../../services/store.service';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-consultation-prescription',
  templateUrl: './consultation-prescription.component.html',
  styleUrls: ['./consultation-prescription.component.scss']
})
export class ConsultationPrescriptionComponent implements OnInit, OnDestroy {
  @Input() dispatchItemEntities: FormArray;
  @Input() index: number;
  @Output() onFirstChargeItemDetailsAdded = new EventEmitter<FormArray>();

  drugSelected: DrugItem;
  bsModalRef: BsModalRef;
  searchKey: FormControl;

  topDrugDescription: TopDrugDescription;
  chargeItemDescription: ChargeItemDescription;
  codesTypeahead = new Subject<string>();
  dosageInstructions: Array<DosageInstruction>;
  dosageInstruction: FormControl;
  totalPrice;

  drugs = [];

  items = [];
  selected = [];

  private componentDestroyed: Subject<void> = new Subject();

  constructor(
    private store: StoreService,
    private modalService: BsModalService,
    private caseChargeFormService: CaseChargeFormService
  ) {}

  ngOnInit() {
    console.log('Pres_Array', this.dispatchItemEntities.controls);
    // this.resetChargeItemDescription();
    this.initialiseUI();
    this.initialiseStore();
    this.updateOverallPrice(true);
    this.store
      .getPatientVisitIdRefresh()
      .pipe(takeUntil(this.componentDestroyed))
      .subscribe(id => {
        if (id) {
          this.initialiseUI();
          this.initialiseStore();
          // this.reset();
        }
      });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.componentDestroyed.next();
    this.componentDestroyed.unsubscribe();
  }

  initialiseStore() {
    this.items = this.store.activeChargeItemList;
  }

  initialiseUI() {
    this.searchKey = new FormControl();

    this.resetChargeItemDescription();

    if (!this.totalPrice) {
      this.totalPrice = 0;
    }

    // this.store
    //   .getPatientVisitIdRefresh()
    //   .pipe(takeUntil(this.componentDestroyed))
    //   .subscribe(id => {
    //     if (id) {
    //       this.reset();
    //     }
    //   });
  }

  onTopChargeItemDescriptionChanged(event: ChargeItemDescription) {
    this.chargeItemDescription = event;
  }

  // reset() {
  //   console.log("RESET CON PRE RESET");
  //   this.resetChargeItemDescription();
  //   if(!this.totalPrice){
  //     this.totalPrice = 0;
  //    }
  // }

  updateOverallPrice(event) {
    if (event) {
      this.totalPrice = 0;

      this.dispatchItemEntities.value.forEach(item => {
        console.log('dispatchItem: ', item);
        const price = parseFloat(item.adjustedTotalPrice);
        this.totalPrice += price;
      });

      // this.totalPrice = parseFloat(this.totalPrice).toFixed(2);
    }
  }

  onDelete(index) {
    this.dispatchItemEntities.removeAt(index);
    this.resetChargeItemDescription();
    this.updateOverallPrice(true);
  }

  resetChargeItemDescription() {
    console.log('RESET CON PRE:', this.chargeItemDescription);
    this.chargeItemDescription = new ChargeItemDescription();
  }

  onDrugSelect(option) {
    this.drugSelected = option;
    this.dispatchItemEntities = this.caseChargeFormService.buildDrugDispatchDetails(option.item);
    this.searchKey.reset();
  }

  onSearchClicked() {
    const initialState = {
      title: 'Advanced Search',
      itemsFormArray: this.dispatchItemEntities
    };

    this.bsModalRef = this.modalService.show(ConsultationSearchComponent, {
      initialState,
      class: 'modal-lg',
      // backdrop: 'static',
      keyboard: false
    });

    this.bsModalRef.content.event.subscribe(data => {
      if (data !== 'close' && data.length > 0) {
        data.forEach(item => {
          this.onDrugSelect(item);
        });
      }
      this.bsModalRef.content.event.unsubscribe();
      this.bsModalRef.hide();
    });
  }
}
