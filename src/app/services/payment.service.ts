import { CaseChargeFormService } from './case-charge-form.service';
// import { API_PATIENT_VISIT_URL } from './../constants/app.constants';
import { AppConfigService } from './app-config.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { DISPLAY_DATE_FORMAT } from '../constants/app.constants';
import { Validators } from '@angular/forms';
import * as moment from 'moment';
import { MaxDiscountClass } from '../objects/response/MaxDiscount';
import { Subject } from '../../../node_modules/rxjs';
import { ApiCmsManagementService } from './api-cms-management.service';
import { AlertService } from './alert.service';

@Injectable()
export class PaymentService {
  consultationInfo;
  consultationInfoObservable: Subject<any> = new Subject();

  chargeFormGroup: FormGroup;
  collectFormGroup: FormGroup;

  visitCoverageArray = [];

  static readonly GST_VALUE = 0.07;
  static readonly DEFAULT_PRICE_ADJUSTMENT = {
    decreaseValue: 0,
    increaseValue: 0,
    paymentType: 'DOLLAR'
  };
  static readonly DEFAULT_MAX_PRICE_ADJUSTMENT = {
    decreaseValue: 10,
    increaseValue: 10,
    paymentType: 'PERCENTAGE'
  };

  constructor(private fb: FormBuilder) {
    this.chargeFormGroup = this.createChargeFormGroup();
    this.collectFormGroup = this.createCollectFormGroup();
  }
  createChargeFormGroupDua(): FormGroup {
    return this.fb.group({
      needRefresh: true,
      coverageLimitFormGroup: this.fb.group({
        coverageLimitArray: this.fb.array([])
      }),
      overallChargeFormGroup: this.fb.group({
        gstValue: 0.07,
        totalAmount: 0,
        overallCharges: { value: [] }
      }),
      printFormGroup: this.fb.group({
        medicalCertificateArray: this.fb.array([]),
        referralArray: this.fb.array([]),
        referralFormGroup: this.fb.group({
          //referralFormGroup Added in by Donna on 18 June for
          clinicId: '', // variables referClinic and referDoctor
          doctorId: '' // in Print Time Chit in payment-print
        }),
        memo: '',
        timeChitFrom: [new Date(), Validators.required],
        timeChitTo: [new Date(), Validators.required]
      }),
      prescriptionFormGroup: this.fb.group({
        itemsArray: this.fb.array([])
      })
    });
  }

  createChargeFormGroup(): FormGroup {
    return this.fb.group({
      needRefresh: true,
      patientInfoFormGroup: this.fb.group({
        patientNo: '',
        patientName: '',
        age: 0,
        sex: '',
        dateOfBirth: moment(new Date(1970, 0, 1)).format(DISPLAY_DATE_FORMAT),
        NRIC: '',
        occupation: '',
        address: ''
      }),
      clinicNoteFormGroup: this.fb.group({
        clinicNotes: { value: '', disabled: true }
      }),
      diagnosisFormGroup: this.fb.group({
        diagnosisArray: this.fb.array([])
      }),
      coverageLimitFormGroup: this.fb.group({
        coverageLimitArray: this.fb.array([])
      }),
      prescriptionFormGroup: this.fb.group({
        isAdd: false,
        charge: '',
        dosageInstruction: '',
        sig: '',
        cautionary: '',
        remarks: '',
        expiryDate: moment(new Date(2019, 0, 1)).format(DISPLAY_DATE_FORMAT),
        itemsArray: this.fb.array([]),
        followUpFormGroup: this.fb.group({
          followupDate: new Date(),
          remarks: ''
        })
      }),
      medicalTestFormGroup: this.fb.group({
        isAdd: false,
        medicalTestArray: this.fb.array([])
      }),
      immunizationFormGroup: this.fb.group({
        isAdd: false,
        immunizationArray: this.fb.array([])
      }),
      referralFormGroup: this.fb.group({
        isAdd: false,
        referralFormArray: this.fb.array([])
      }),
      overallChargeFormGroup: this.fb.group({
        gstValue: 0.07,
        overallCharges: { value: [] }
      }),
      printFormGroup: this.fb.group({
        medicalCertificateArray: this.fb.array([]),
        referralArray: this.fb.array([]),
        referralFormGroup: this.fb.group({
          //referralFormGroup Added in by Donna on 18 June for
          clinicId: '', // variables referClinic and referDoctor
          doctorId: '' // in Print Time Chit in payment-print
        }),
        memo: '',
        timeChitFrom: [new Date(), Validators.required],
        timeChitTo: [new Date(), Validators.required]
      }),
      memo: ''
    });
  }

  createCollectFormGroup(): FormGroup {
    return this.fb.group({
      needRefresh: true,
      patientInfoFormGroup: this.fb.group({
        ...this.chargeFormGroup.get('patientInfoFormGroup').value
      }),
      collectChargeFormGroup: this.fb.group({
        mainCharge: 0,
        mainChargeGst: 0,
        otherCharge: 0,
        otherChargeGst: 0,
        gstValue: 0.07,
        cashRoundAdjustedValue: 0,
        payCashOnly: false
      }),
      paymentFormGroup: this.fb.group({
        paymentArray: this.fb.array([
          this.createPaymentMethodArrayItem('CASH'),
          this.createPaymentMethodArrayItem('NETS'),
          this.createPaymentMethodArrayItem('VISA')
        ]),
        otherCharge: 0,
        otherChargeGst: 0,
        cashRoundAdjustedValue: 0,
        outstanding: '0.00', //real outstanding, have logic to check users payment method
        cashOutstanding: '0.00',
        totalOutstanding: '0.00',
        chargeBack: 0
      }),
      printFormGroup: this.fb.group({
        receiptTypes: {
          value: [
            { value: 'general', label: 'General' },
            // { value: 'detail', label: 'Detail' },
            { value: 'breakdown', label: 'Breakdown' }
          ]
        },
        receiptType: 'general',
        printAll: false,
        disablePageBreak: false
      })
    });
  }

  createPaymentMethodArrayItem(payType: string = ''): FormGroup {
    return this.fb.group({
      payment: payType,
      amount: [0, Validators.required],
      transactionId: '',
      bank: ''
    });
  }

  getChargeFormGroup(): FormGroup {
    return this.chargeFormGroup;
  }

  getCollectFormGroup(): FormGroup {
    return this.collectFormGroup;
  }

  setChargeFormGroup(formGroup: FormGroup) {
    this.chargeFormGroup = formGroup;
  }

  setCollectFormGroup(formGroup: FormGroup) {
    this.collectFormGroup = formGroup;
  }

  resetChargeFormGroup() {
    this.chargeFormGroup = this.createChargeFormGroup();
  }

  resetCollectFormGroup() {
    this.collectFormGroup = this.createCollectFormGroup();
  }

  setMedicalServiceFormGroup(medicalServiceFormGroup: FormGroup) {
    this.chargeFormGroup.patchValue(
      {
        medicalServiceFormGroup: medicalServiceFormGroup
      },
      {
        emitEvent: false
      }
    );
  }

  setPrescriptionFormGroup(prescriptionFormGroup: FormGroup) {
    this.chargeFormGroup.patchValue(
      {
        prescriptionFormGroup: prescriptionFormGroup
      },
      {
        emitEvent: false
      }
    );
  }

  setMedicalTestFormGroup(medicalTestFormGroup: FormGroup) {
    this.chargeFormGroup.patchValue(
      {
        medicalTestFormGroup: medicalTestFormGroup
      },
      {
        emitEvent: false
      }
    );
  }

  setImmunizationFormGroup(immunizationFormGroup: FormGroup) {
    this.chargeFormGroup.patchValue(
      {
        immunizationFormGroup: immunizationFormGroup
      },
      {
        emitEvent: false
      }
    );
  }

  getConsultationInfo() {
    return this.consultationInfo;
  }

  getConsultationInfoObservable(): Observable<any> {
    return this.consultationInfoObservable;
  }

  setConsultationInfo(consultationInfo) {
    this.consultationInfo = consultationInfo;
    console.log('set');
    this.consultationInfoObservable.next(consultationInfo);
  }

  resetVisitCoverageArray() {
    this.visitCoverageArray = [];
  }

  reproportionChargeAndGst(charge, gst, gstValue): [number, number] {
    const taxedCharge = gst / gstValue;
    const untaxedCharge = charge - taxedCharge;
    const untaxedChargeTax = untaxedCharge * (gstValue / (1 + gstValue));
    return [charge - untaxedChargeTax, gst + untaxedChargeTax];
  }

  updateDiscountGiven(discountGiven, values) {
    discountGiven.decreaseValue = values.priceAdjustment.decreaseValue;
    discountGiven.increaseValue = values.priceAdjustment.increaseValue;
    discountGiven.remarks = values.priceAdjustment.remark;
  }

  updateExcludedCoveragePlanIds(info, excludedPlanIds) {
    if (excludedPlanIds) {
      info.excludedCoveragePlanIds = excludedPlanIds;
    } else {
      info.excludedCoveragePlanIds = [];
    }
  }

  convertPriceAdjustmentToAbsolutePriceAdjustment(unitPrice: number, priceAdjustment) {
    let maxDiscount = 999999;
    let maxIncrease = 999999;
    maxDiscount = priceAdjustment.decreaseValue;
    maxIncrease = priceAdjustment.increaseValue;
    return [maxDiscount, maxIncrease];
  }

  convertDiscountToAbsoluteDiscount(unitPrice: number, discountGiven, priceAdjustment) {
    let discount = 0;
    let increase = 0;
    discount = discountGiven.decreaseValue;
    increase = discountGiven.increaseValue;
    const [maxDiscount, maxIncrease] = this.convertPriceAdjustmentToAbsolutePriceAdjustment(unitPrice, priceAdjustment);
    if (discount >= maxDiscount) {
      discount = maxDiscount;
    }
    // if (increase >= maxIncrease) {
    //   increase = maxIncrease;
    // }
    return [discount, increase];
  }

  newArrayItemCommonValue() {
    return {
      unitPrice: 0,
      unitPriceStr: { value: '$0.00', disabled: true },
      priceAdjustment: this.buildPriceAdjustment(),
      maxDiscount: new MaxDiscountClass(),
      price: 0,
      priceStr: { value: '$0.00', disabled: true },
      taxIncluded: false,
      adjustTotalPrice: { value: '$0.00', disabled: true },

      stock: 9999,
      remarks: '',
      isCollapsed: true,

      plans: { value: [] },
      plan: '',

      isDelete: false,
      deleteIndex: -1
    };
  }

  formatArrayItemCommonValue(
    unitPrice,
    unitPriceStr,
    discount,
    increase,
    maxDiscount,
    maxIncrease,
    paymentType,
    price,
    priceStr,
    taxIncluded,
    adjustTotalPrice,
    stock,
    priceRemarks,
    plans: any,
    plan: any
  ) {
    return {
      unitPrice,
      unitPriceStr: { value: unitPriceStr, disabled: true },
      priceAdjustment: this.buildPriceAdjustment(discount, increase, paymentType, priceRemarks),
      maxDiscount: new MaxDiscountClass(maxDiscount, maxIncrease, paymentType),
      price,
      priceStr: { value: priceStr, disabled: true },
      taxIncluded,
      adjustTotalPrice: { value: adjustTotalPrice, disabled: true },

      stock,
      isCollapsed: discount === 0 && increase === 0,

      plans: { value: plans },
      plan: { value: plan },

      isDelete: false,
      deleteIndex: -1
    };
  }

  buildPriceAdjustment(
    decreaseValue: number = 0,
    increaseValue: number = 0,
    paymentType: string = '',
    remark: string = ''
  ) {
    return new FormGroup({
      decreaseValue: new FormControl(decreaseValue),
      increaseValue: new FormControl(increaseValue),
      paymentType: new FormControl(paymentType),
      remark: new FormControl(remark)
    });
  }

  calculateTotalPrice(
    unitPrice: number,
    quantity: number,
    discount: number,
    increase: number,
    paymentType: string
  ): number {
    if (increase) {
      const absIncrease = paymentType === 'DOLLAR' ? increase : (unitPrice * increase) / 100;
      return (unitPrice + absIncrease) * quantity;
    }
    const absDiscount = paymentType === 'DOLLAR' ? discount : (unitPrice * discount) / 100;
    return (unitPrice - absDiscount) * quantity;
  }

  // Validator
  validateDiscount(control: FormGroup) {
    const discount = control.get('discount');
    const increase = control.get('increase');
    const maxDiscount = control.get('maxDiscount');
    const maxIncrease = control.get('maxIncrease');

    if (!discount || !maxDiscount || !maxIncrease) return null;

    const value = {
      invalidDiscount: null
      // invalidIncrease: null,
    };
    if (discount.value > maxDiscount.value) {
      value.invalidDiscount = { value: discount.value, message: 'NO Discount is Allowed' };
    } else {
      return null;
    }
    // if (increase.value > maxIncrease.value) {
    //   value.invalidIncrease = true;
    // }
    return value;
  }
}
