import { ConsultationFormService } from './consultation-form.service';
import { MedicalCertificateItemControlComponent } from './../components/consultation/consultation-medical-certificate/medical-certificate-item-control.component';
import { ApiCaseManagerService } from './api-case-manager.service';
import { AlertService } from './alert.service';
import { ApiCmsManagementService } from './api-cms-management.service';
import { Observable, Subject, timer, BehaviorSubject } from 'rxjs';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormBuilder,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';
import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { ChargeDetailsItem } from '../../app/objects/request/ChargeDetails';
import { Consultation } from '../objects/response/PatientVisitList';

@Injectable()
export class CaseChargeFormService {
  chargeItemDetails: FormArray;
  caseItemPriceObservable = new BehaviorSubject<any>(undefined);

  constructor(
    private fb: FormBuilder
  ) {}

  resetForm() {
    if (this.chargeItemDetails) {
      this.chargeItemDetails = new FormArray([]);
    }

    return this.chargeItemDetails;
  }

  addMultipleChargeItems(addNewRow: boolean, count: number) {
    if (!addNewRow) {
      this.chargeItemDetails = null;
    }
    for (let index = 0; index < count; index++) {
      this.buildDrugDispatchDetails();
    }
    return this.chargeItemDetails;
  }
  createEmptyDispatchDetails() {
    this.chargeItemDetails = new FormArray([]);
    console.log("RESETTING EMPTY DISPATCH");
    return this.chargeItemDetails;
  }

  buildDrugDispatchDetails(option = undefined) {
    const dose = this.buildDose('', 0);
    const dosageInstruction = this.buildDoseInstruction('', '');
    const instruction = this.buildInstruction('', 0, '', '');
    const priceAdjustment = this.buildPriceAdjustment(0, '', '');
    const medicalCoverages = this.buildAttachedMedicalCoverage('', '');
    const drugId = new FormControl((option || { id: '' }).id);
    const batchNumber = new FormControl('');
    const expiryDate = new FormControl('');
    const remark = new FormControl('');
    const purchaseQty = new FormControl('');
    const duration = new FormControl('');
    const stock = new FormControl('');
    const inventoryInvalid = new FormControl();
    const excludedCoveragePlanIds = new FormControl();
    const cautionary = this.fb.array([]);
    const salesItemCode = new FormControl('');
    const isChecked = new FormControl('');
    const unitPrice = this.buildUnitPrice('', false);
    const oriTotalPrice = new FormControl('');
    const adjustedTotalPrice = new FormControl(0);
    const purchasedId =  new FormControl(''); 
    const originalTotalPrice =  new FormControl(''); 
    const inventoryData =  this.buildInventory('',''); 

    this.addDrugDispatchDetails(
      drugId,
      batchNumber,
      expiryDate,
      remark,
      dose,
      dosageInstruction,
      instruction,
      priceAdjustment,
      medicalCoverages,
      purchaseQty,
      duration,
      stock,
      inventoryInvalid,
      excludedCoveragePlanIds,
      cautionary,
      salesItemCode,
      oriTotalPrice,
      adjustedTotalPrice,
      purchasedId,
      isChecked,
      unitPrice,
      originalTotalPrice,
      inventoryData
    );

    return this.chargeItemDetails;
  }

  addDrugDispatchDetails(
    drugId: FormControl,
    batchNumber: FormControl,
    expiryDate: FormControl,
    remark: FormControl,
    dose: FormGroup,
    dosageInstruction: FormGroup,
    instruction: FormGroup,
    priceAdjustment: FormGroup,
    medicalCoverage: FormGroup,
    purchaseQty: FormControl,
    duration: FormControl,
    stock: FormControl,
    inventoryInvalid: FormControl,
    excludedCoveragePlanIds: FormControl,
    cautionary: FormArray,
    salesItemCode: FormControl,
    oriTotalPrice: FormControl,
    adjustedTotalPrice: FormControl,
    purchasedId: FormControl,
    isChecked: FormControl,
    unitPrice: FormGroup,
    originalTotalPrice: FormControl,
    inventoryData: FormGroup
  ) {
    const newDrugDispatchDetail = new FormGroup({
      drugId: drugId,
      batchNumber: batchNumber,
      expiryDate: expiryDate,
      remark: remark,
      dose: dose,
      dosageInstruction: dosageInstruction,
      instruction: instruction,
      priceAdjustment: priceAdjustment,
      attachedMedicalCoverages: medicalCoverage,
      purchaseQty: purchaseQty,
      duration: duration,
      stock: stock,
      inventoryInvalid: inventoryInvalid,
      excludedCoveragePlanIds: excludedCoveragePlanIds,
      cautionary: cautionary,
      salesItemCode: salesItemCode,
      isChecked: isChecked,
      unitPrice: unitPrice,
      oriTotalPrice: oriTotalPrice,
      adjustedTotalPrice: adjustedTotalPrice,
      purchasedId: purchasedId,
      originalTotalPrice: originalTotalPrice,
      inventoryData: inventoryData
    });

    if (this.chargeItemDetails) {
      console.log("chargeItemDetails not Empty: ",this.chargeItemDetails);
      console.log("chargeItemDetails not Empty pushing newDrugDispatch: ",newDrugDispatchDetail);
      this.chargeItemDetails.push(newDrugDispatchDetail);
    } else {
      console.log("chargeItemDetails Empty: ",this.chargeItemDetails);
      this.chargeItemDetails = new FormArray([newDrugDispatchDetail]);
    }

    console.log("chargeItemDetails final: ",this.chargeItemDetails);
  }

  initDrugDispatchDetails() {
    const dose = this.buildDose('', 0);
    const dosageInstruction = this.buildDoseInstruction('', '');
    const instruction = this.buildInstruction('', 0, '', '');
    const priceAdjustment = this.buildPriceAdjustment(0, '', '');
    const medicalCoverages = this.buildAttachedMedicalCoverage('', '');
    const drugId = new FormControl('');
    const batchNumber = new FormControl('');
    const expiryDate = new FormControl('');
    const remark = new FormControl('');
    const purchaseQty = new FormControl('');
    const duration = new FormControl('');
    const stock = new FormControl('');
    const inventoryInvalid = new FormControl();
    const excludedCoveragePlanIds = new FormControl();
    const cautionary = this.fb.array([]);
    const purchasedId = new FormControl('');
    const cost = this.buildCost('',false);
    const isChecked = new FormControl('');
    const unitPrice = this.buildUnitPrice('', false);
    const originalTotalPrice = new FormControl('');
    const inventoryData = this.buildInventory('','');
    const salesItemCode = new FormControl('');
    const oriTotalPrice = new FormControl('');
    const adjustedTotalPrice = new FormControl('');

    this.addDrugDispatchDetails(drugId,
      batchNumber,
      expiryDate,
      remark,
      dose,
      dosageInstruction,
      instruction,
      priceAdjustment,
      medicalCoverages,
      purchaseQty,
      duration,
      stock,
      inventoryInvalid,
      excludedCoveragePlanIds,
      cautionary,
      salesItemCode,
      oriTotalPrice,
      adjustedTotalPrice,
      purchasedId,
      isChecked,
      unitPrice,
      originalTotalPrice,
      inventoryData
    )

    return this.chargeItemDetails;
  }

  buildDose(uom: string, quantity: number) {
    return this.fb.group({
      uom: this.fb.control(uom),
      quantity: this.fb.control(quantity)
    });
  }

  buildUnitPrice(price: string, taxIncluded: boolean) {
    return this.fb.group({
      price: this.fb.control(price),
      taxIncluded: this.fb.control(taxIncluded)
    });
  }

  buildCost(price: string, taxIncluded: boolean) {
    return this.fb.group({
      price: this.fb.control(price),
      taxIncluded: this.fb.control(taxIncluded)
    });
  }

  buildDoseInstruction(code: string, instruct: string) {
    return new FormGroup({ code: new FormControl(code), instruct: new FormControl(instruct) });
  }

  buildInstruction(code: string, frequencyPerDay: number, instruct: string, cautionary: string) {
    return new FormGroup({
      code: new FormControl(code),
      frequencyPerDay: new FormControl(frequencyPerDay),
      instruct: new FormControl(instruct),
      cautionary: new FormControl(cautionary)
    });
  }

  buildPriceAdjustment(
    adjustedValue: number,
    // decreaseValue: number,
    // increaseValue: number,
    paymentType: string,
    remark: string
  ) {
    return new FormGroup({
      // decreaseValue: new FormControl(decreaseValue),
      // increaseValue: new FormControl(increaseValue),
      adjustedValue: new FormControl(adjustedValue),
      paymentType: new FormControl(paymentType),
      remark: new FormControl(remark)
    });
  }

  buildAttachedMedicalCoverage(medicalCoverageId: string, planId: string) {
    return new FormGroup({
      medicalCoverageId: new FormControl(medicalCoverageId),
      planId: new FormControl(planId)
    });
  }

  // Bind Charge Item to Purchase Item
  bindChargeItemsToDispatchitemEntities(formArr) {
    console.log('formArr = ', formArr);

    let newPurchaseitems = [];
    if (formArr) {
      newPurchaseitems = formArr
        .filter(function(payload) {
          if (payload.value.drugId == '' || payload.value.drugId == undefined || payload.value.drugId == null)
            return false;
          return true;
        })
        .map(payload => {
          if (payload.value.drugId == '') return null;
          let isService = (payload.value.dose && payload.value.instruction.code) ? false : true;
          let tempItem = {
            itemId: payload.value.drugId,
            duration: payload.value.duration,
            quantity: payload.value.purchaseQty,
            oriTotalPrice: Math.round(payload.value.oriTotalPrice),
            batchNo: payload.value.batchNumber,
            expiryDate: payload.value.expiryDate,
            remarks: payload.value.remark,
            itemPriceAdjustment: {
              adjustedValue: Math.round(payload.value.priceAdjustment.adjustedValue),
              paymentType: payload.value.priceAdjustment.paymentType || 'DOLLAR',
              remark: payload.value.priceAdjustment.remark
            },
            excludedCoveragePlanIds: payload.value.excludedCoveragePlanIds
          };
          if(!isService){
            tempItem['instruct'] = payload.value.instruction.code;
            tempItem['dosageUom'] = payload.value.dose.uom;
            tempItem['dosage'] = payload.value.dose.quantity;
            tempItem['dosageInstruction'] = payload.value.dosageInstruction.code
          }
          console.log('tempItem = ', tempItem);
          return tempItem;
        });
    }
    console.log('purchaseItem = ', newPurchaseitems);

    return newPurchaseitems;
  }

  buildChargeDetailsItem(itemId: string, excludedPlans: any[], quantity?: number) {
    return new ChargeDetailsItem(itemId, excludedPlans, quantity);
  }

  buildInventory(batchNo: string, expireDate: string) {
    return new FormGroup({
      batchNo: new FormControl(batchNo),
      expireDate: new FormControl(expireDate)
    });
}
}
export function mulitplierValidator(multiplier: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    return (control.value * 1000) % (multiplier * 1000) !== 0 ? { multiplierError: { multiplier: multiplier } } : null;
  };
}
