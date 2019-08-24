import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ApiCmsManagementService } from './api-cms-management.service';
import { CaseChargeFormService } from './case-charge-form.service';
import { StoreService } from './store.service';
import { DISPLAY_DATE_FORMAT, INPUT_DELAY } from './../constants/app.constants';
import {
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder,
  ValidatorFn,
  AbstractControl,
  Validators
} from '@angular/forms';
import { Injectable } from '@angular/core';
import { AtLeastOneFieldValidator } from '../validators/AtLeastOneValidator';
import { MedicalCertificateItemsArrayComponent } from './../components/consultation/consultation-medical-certificate/medical-certificate-items-array.component';
import * as moment from 'moment';
import { AlertService } from './alert.service';

@Injectable()
export class ConsultationFormService {
  diagnosis: FormArray;
  followupConsultation: FormGroup;

  patientReferral: FormArray;

  constructor(
    private fb: FormBuilder,
    private store: StoreService,
    private caseChargeFormService: CaseChargeFormService,
    private apiCmsManagementService: ApiCmsManagementService,
    private alertService: AlertService
  ) {}

  resetForm() {
    if (this.diagnosis && this.patientReferral) {
      this.diagnosis.controls = [];
      this.patientReferral.controls = [];
      // this.followupConsultation.reset();
    }
  }

  // CONSULTATION
  initConsultation() {
    return this.fb.group({
      patientId: '',
      consultationNotes: '',
      memo: '',
      clinicNotes: '',
      doctorId: '',
      clinicId: ''
    });
  }

  createConsultationFormGroup() {
    return this.fb.group({
      consultation: this.initConsultation(),
      diagnosisIds: this.initDiagnosis(),
      medicalCertificates: MedicalCertificateItemsArrayComponent.buildItems(),
      consultationFollowup: this.initFollowupDua(),
      patientReferral: this.fb.group({ patientReferrals: this.initPatientReferral() }),
      dispatchItemEntities: this.caseChargeFormService.createEmptyDispatchDetails()
    });
  }

  resetConsultationFormGroup() {
    return this.fb.group({});
  }

  checkConsultation(consultation) {
    consultation.consultation.clinicId = this.store.clinicId;
    consultation.consultation.clinicNotes = consultation.consultation.clinicNotes
      ? consultation.consultation.clinicNotes
      : '';
    consultation.consultation.patientId = this.store.getPatientId();
    consultation.consultation.doctorId = this.store.getUser().context['cms-user-id'];

    return consultation;
  }

  patchConsultationToFormGroup(refEntity, consultation: AbstractControl) {
    if (refEntity.consultation) {
      const cons = refEntity.consultation;
      consultation.patchValue({
        patientId: cons.patientId,
        consultationNotes: cons.consultationNotes,
        memo: cons.memo,
        clinicNotes: cons.clinicNotes,
        doctorId: cons.doctorId,
        clinicId: cons.clinicId
      });
    }
  }

  flattenDiagnosis(consultation) {
    const diagnosisIds = [];

    consultation.diagnosisIds.forEach(diagnosis => {
      console.log('diagnosis: ', diagnosis);
      if (diagnosis.id !== '' || diagnosis.id !== undefined || diagnosis.id.length > 0) {
        diagnosisIds.push(diagnosis.id);
      }
    });

    consultation.diagnosisIds = diagnosisIds;
    return consultation;
  }

  // ITEM --- CMS-DUA
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

  buildPriceAdjustment(decreaseValue: number, increaseValue: number, paymentType: string, remark: string) {
    return new FormGroup({
      decreaseValue: new FormControl(decreaseValue),
      increaseValue: new FormControl(increaseValue),
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

  // PATIENT REFERRAL //
  initPatientReferral() {
    console.log('entering patient referral:', this.patientReferral);
    const practice = new FormControl();
    const clinicId = new FormControl();
    const doctorId = new FormControl();
    const appointmentDateTime = new FormControl();
    const memo = new FormControl('');
    const str = new FormControl();
    const externalReferral = new FormControl();
    const externalReferralDetails = this.fb.group({
      doctorName: '',
      address: '',
      phoneNumber: ''
    });

    externalReferral.patchValue(false);

    this.addPatientReferral(
      practice,
      clinicId,
      doctorId,
      appointmentDateTime,
      memo,
      str,
      externalReferral,
      externalReferralDetails
    );

    return this.patientReferral;
  }

  addPatientReferral(
    practice: FormControl = new FormControl(),
    clinicId: FormControl = new FormControl(),
    doctorId: FormControl = new FormControl(),
    appointmentDateTime: FormControl = new FormControl(),
    memo: FormControl = new FormControl(''),
    str: FormControl = new FormControl(),
    externalReferral: FormControl = new FormControl(),
    externalReferralDetails: FormGroup = this.fb.group({
      doctorName: '',
      address: '',
      phoneNumber: ''
    })
  ) {
    const newPatientReferral = new FormGroup({
      practice: practice,
      clinicId: clinicId,
      doctorId: doctorId,
      appointmentDateTime: appointmentDateTime,
      memo: memo,
      str: str,
      externalReferral: externalReferral,
      externalReferralDetails: externalReferralDetails
    });

    // If form exists, push referral in
    if (this.patientReferral) {
      console.log('push form');
      this.patientReferral.push(newPatientReferral);
    } else {
      console.log('create and initialise form');
      this.patientReferral = new FormArray([newPatientReferral]);
    }
  }

  buildPatientReferral(
    practice: FormControl,
    clinicId: FormControl,
    doctorId: FormControl,
    appointmentDateTime: FormControl,
    memo: FormControl,
    str: FormControl,
    externalReferral: FormControl,
    externalReferralDetails: FormGroup
  ) {
    const newPatientReferral = this.fb.group({
      practice: practice,
      clinicId: clinicId,
      doctorId: doctorId,
      appointmentDateTime: appointmentDateTime,
      memo: memo,
      str: str,
      externalReferral: externalReferral,
      externalReferralDetails: externalReferralDetails
    });

    return newPatientReferral;
  }

  checkPatientReferral(consultation) {
    if (consultation.patientReferral) {
      const currentPatientReferrals = consultation.patientReferral.patientReferrals;

      let newCurrentPatientReferrals = currentPatientReferrals.filter(
        value =>
          (value.practice &&
            value.practice !== '' &&
            value.clinicId &&
            value.clinicId !== '' &&
            value.doctorId &&
            value.doctorId !== '' &&
            value.appointmentDateTime !== '') ||
          (value.practice &&
            value.externalReferralDetails &&
            value.practice !== '' &&
            value.externalReferralDetails.doctorName &&
            value.externalReferralDetails.doctorName !== '' &&
            value.externalReferralDetails.address &&
            value.externalReferralDetails.address !== '') ||
          value.externalReferral
      );

      newCurrentPatientReferrals = newCurrentPatientReferrals.map(x => {
        delete x['str'];
        return x;
      });

      if (newCurrentPatientReferrals.length > 0) {
        consultation.patientReferral.patientReferrals = newCurrentPatientReferrals;
      } else {
        delete consultation['patientReferral'];
      }
    }
    return consultation;
  }

  // PATIENT REFERRAL //
  patchReferralToFormArray(refEntity, referrals: FormArray) {
    if (
      refEntity.patientReferral &&
      refEntity.patientReferral.patientReferrals &&
      refEntity.patientReferral.patientReferrals.length
    ) {
      while (referrals.length) {
        referrals.removeAt(0);
      }
      refEntity.patientReferral.patientReferrals.forEach(referral => {
        this.addPatientReferral();
        referrals.at(referrals.length - 1).patchValue(referral);
      });
    }
  }
  // DIAGNOSIS
  initDiagnosis() {
    const id = new FormControl('', [Validators.required]);
    this.addDiagnosis(id);

    return this.diagnosis;
  }

  addDiagnosis(id: FormControl) {
    const newDiagnosisItem = new FormGroup({
      id: id
    });

    if (this.diagnosis) {
      this.diagnosis.push(newDiagnosisItem);
    } else {
      this.diagnosis = new FormArray([newDiagnosisItem], this.emptyFormArrayValidator('id'));
    }
  }

  removeDiagnosis(index) {
    this.diagnosis.removeAt(index);
  }

  patchDiagnosisToFormArray(refEntity, diagnosisArray: FormArray) {
    if (refEntity.diagnosisIds) {
      this.apiCmsManagementService
        .searchDiagnosisByIds(refEntity.diagnosisIds)
        .pipe(
          debounceTime(INPUT_DELAY),
          distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
        )
        .subscribe(
          res => {
            diagnosisArray.controls = [];
            const diagnosis = res.payload;
            diagnosis.forEach(diagnosisItem => {
              console.log('diagnosisItem: ', diagnosisItem);
              diagnosisArray.push(
                this.fb.group({
                  icd10Code: diagnosisItem.icd10Code,
                  icd10Id: diagnosisItem.icd10Id,
                  icd10Term: diagnosisItem.icd10Term,
                  id: diagnosisItem.id,
                  snomedId: diagnosisItem.snomedId,
                  status: diagnosisItem.status
                })
              );
            });
          },
          err => {
            this.alertService.error(JSON.stringify(err.error.message));
          }
        );
    }
  }

  // Patch Dispatch to Formgroup
  patchDispatchItemsToFormArray(refEntity, dispatchItemEntities: FormArray) {
    if (refEntity.dispatchItemEntities && refEntity.dispatchItemEntities.length > 0) {
      dispatchItemEntities.controls = [];
      while (dispatchItemEntities.length > 0) {
        dispatchItemEntities.removeAt(0);
      }

      let items = this.store.chargeItemList;
      for (let i = 0; i < refEntity.dispatchItemEntities.length; i++) {
        let purchaseItem = refEntity.dispatchItemEntities[i];
        console.log('pa-di refEntity purchaseItem: ', purchaseItem);
        console.log('pa-di refEntity purchaseItem batchNo: ', purchaseItem.batchNo);
        let item = items.find(item => {
          return item.item.id === purchaseItem.itemId;
        });

        if (item) {
          console.log('pa-di item: ', item);
          const dispatchItemFB = this.fb.group({
            drugId: purchaseItem.itemId,
            batchNumber: purchaseItem.batchNo,
            expiryDate: purchaseItem.expiryDate || '',
            remark: purchaseItem.remarks || '',
            dose: this.fb.group({
              uom: purchaseItem.dosageUom || '',
              quantity: purchaseItem.dosage || ''
            }),
            dosageInstruction: this.fb.group({
              code: purchaseItem.dosageInstruction || '',
              instruct: ''
            }),
            instruction: this.fb.group({
              code: purchaseItem.instruct || ''
            }),
            priceAdjustment: this.fb.group({
              adjustedValue: purchaseItem.itemPriceAdjustment.adjustedValue || 0,
              paymentType: purchaseItem.itemPriceAdjustment.paymentType || 'DOLLAR',
              remark: purchaseItem.itemPriceAdjustment.remark || ''
            }),
            attachedMedicalCoverages: purchaseItem.medicalCoverages || [],
            purchaseQty: purchaseItem.quantity || '',
            duration: purchaseItem.duration || '',
            stock: '',
            inventoryInvalid: '',
            excludedCoveragePlanIds: purchaseItem.excludedCoveragePlanIds || [],
            cautionary: item.cautionary || '',
            salesItemCode: (item || { code: '' }).code,
            isChecked: false,
            unitPrice: this.fb.group({
              price: item.item.sellingPrice.price / 100,
              taxIncluded: item.item.sellingPrice.taxIncluded
            }),
            oriTotalPrice: purchaseItem.oriTotalPrice,
            adjustedTotalPrice: 0
          });
          dispatchItemEntities.push(dispatchItemFB);
          console.log('pa-di dispatch after push: ', dispatchItemEntities);
        }
      }
      console.log('Dispatch Item :', dispatchItemEntities);
    }

    this.caseChargeFormService.chargeItemDetails = dispatchItemEntities;
  }

  // FOLLOW UP
  initFollowup() {
    return this.fb.group({ followupDate: '', remarks: '' });
  }

  setFollowup(followupDate?: string, remarks?: string) {
    if (this.followupConsultation) {
      this.followupConsultation.patchValue({ followupDate: followupDate || '', remarks: remarks || '' });
    } else {
      this.followupConsultation = this.fb.group({ followupDate: followupDate || '', remarks: remarks || '' });
    }
    return this.followupConsultation;
  }

  initFollowupDua() {
    return this.fb.group({
      patientId: this.store.getPatientId(),
      patientVisitId: this.store.getPatientVisitRegistryId(),
      doctorId: this.store.getUser().context['cms-user-id'],
      clinicId: this.store.getClinicId(),
      followupDate: '',
      remarks: '',
      reminderStatus: this.fb.group({
        reminderSent: '',
        reminderSentTime: '',
        sentSuccessfully: '',
        remark: '',
        externalReferenceNumber: ''
      })
    });
  }

  checkFollowUp(consultation) {
    if (consultation.consultationFollowup) {
      const currentPatientFollowUp = consultation.consultationFollowup;

      console.log('consultationFollowup: ', currentPatientFollowUp);

      if (
        currentPatientFollowUp.followupDate === '' ||
        !currentPatientFollowUp.followupDate ||
        (currentPatientFollowUp.remarks === '' || !currentPatientFollowUp.remarks)
      ) {
        delete consultation.consultationFollowup;
      } else {
        consultation.consultationFollowup.followupDate =
          consultation.consultationFollowup.followupDate &&
          moment(consultation.consultationFollowup.followupDate, DISPLAY_DATE_FORMAT).format(DISPLAY_DATE_FORMAT);
      }
    }
    return consultation;
  }

  patchFollowUpToFormGroup(refEntity, consultationFollowUp: AbstractControl) {
    if (refEntity.consultationFollowup) {
      consultationFollowUp.reset();

      const c = refEntity.consultationFollowup;
      consultationFollowUp.patchValue({
        patientId: c.patientId,
        patientVisitId: c.patientVisitId,
        doctorId: c.doctorId,
        clinicId: c.clinicId,
        followupDate: c.followupDate,
        remarks: c.remarks,
        reminderStatus: this.fb.group({
          reminderSent: c.reminderStatus.reminderSent,
          reminderSentTime: c.reminderStatus.reminderSentTime,
          sentSuccessfully: c.reminderStatus.sentSuccessfully,
          remark: c.reminderStatus.remark,
          externalReferenceNumber: c.reminderStatus.externalReferenceNumber
        })
      });
    }
  }

  // Memo

  patchMemoToFormGroup(refEntity, memo: AbstractControl) {
    if (refEntity.consultation) {
      memo.patchValue(refEntity.consultation.memo);
    }
  }

  // VITAL FORM
  generateVitalForm(): FormGroup {
    const formGroup = new FormGroup(
      {
        weight: new FormControl(''),
        height: new FormControl(''),
        bmi: new FormControl(''),
        bp: this.fb.group(
          {
            systolic: new FormControl(''),
            diastolic: new FormControl('')
          },
          AtLeastOneFieldValidator
        ),
        pulse: new FormControl(''),
        respiration: new FormControl(''),
        temperature: new FormControl(''),
        sa02: new FormControl(''),
        others: new FormControl('')
      },
      AtLeastOneFieldValidator
    );

    // formGroup.setValidators(AtLeastOneFieldValidator);
    return formGroup;
  }
  // VITAL FORM

  // Validation for Diagnosis
  // Only works for FormArray with FormControl as direct child
  emptyFormArrayValidator(validationKey: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const controlArray = <FormArray>control;
      const controlArrayValue = controlArray.value;
      let isValid = false;

      // loop through the Array
      controlArrayValue.forEach((value, key) => {
        // loop through the content of the Array which could be object
        for (const innerKey of Object.keys(value)) {
          if (innerKey === validationKey) {
            if (value[innerKey] && value[innerKey].length > 0) {
              isValid = true;
              return;
            }
          }
        }
      });
      return isValid ? null : { formArrayRequired: { value: control.value } };
    };
  }
}

export function mulitplierValidator(multiplier: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    return Math.round(control.value * 1000) % Math.round(multiplier * 1000) !== 0
      ? { multiplierError: { multiplier: multiplier } }
      : null;
  };
}
