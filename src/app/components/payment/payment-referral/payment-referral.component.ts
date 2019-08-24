import { externalReferralDetails } from './../../../objects/request/PatientReferral';
import { FormArray, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { ConsultationFormService } from './../../../services/consultation-form.service';
import { StoreService } from './../../../services/store.service';

@Component({
  selector: 'app-payment-referral',
  templateUrl: './payment-referral.component.html',
  styleUrls: ['./payment-referral.component.scss']
})
export class PaymentReferralComponent implements OnInit {
  @Input() itemsFormArray: FormArray;
  @Input() referralFormGroup: FormGroup;
  minDate = new Date(2017, 5, 10);
  maxDate = new Date();

  bsValue: Date = new Date();
  bsRangeValue: any = [new Date(2017, 7, 4), new Date(2017, 7, 20)];

  codes: string[];
  constructor(
    private consultationFormService: ConsultationFormService,
    private fb: FormBuilder,
    private store: StoreService
  ) {}

  ngOnInit() {}

  onBtnAddClicked() {
    this.addPatientReferral();
  }

  addPatientReferral() {
    const practice = new FormControl();
    const clinicId = new FormControl();
    const doctorId = new FormControl();
    const appointmentDateTime = new FormControl();
    const memo = new FormControl();
    const externalReferral = new FormControl();
    const externalReferralDetails = this.fb.group({
      doctorName: '',
      address: '',
      phoneNumber: ''
    });
    const str = new FormControl();

    externalReferral.patchValue(false);

    const newPatientReferral = new FormGroup({
      practice: practice,
      clinicId: clinicId,
      doctorId: doctorId,
      appointmentDateTime: appointmentDateTime,
      memo: memo,
      externalReferral: externalReferral,
      externalReferralDetails: externalReferralDetails,
      str: str
    });

    this.subscribeItemArrayChanges(newPatientReferral);

    if (this.itemsFormArray) {
      this.itemsFormArray.push(newPatientReferral);
    } else {
      this.itemsFormArray = new FormArray([newPatientReferral]);
    }
  }

  subscribeItemArrayChanges(form: FormGroup) {
    form.valueChanges.subscribe(values => {
      let str = '';
      if (!values.externalReferral) {
        if (values.doctorId && values.clinicId) {
          const doctor = this.store.getDoctorList().find(doctor => doctor.id === values.doctorId);
          const clinic = this.store.getClinicList().find(clinic => clinic.id === values.clinicId);
          str = values.memo
            ? `Referral letter to ${doctor.name} (${clinic.name}@${clinic.address.address || ''} Singapore ${
                clinic.address.postalCode
              })`
            : '';
          values.str = str;
        }
      } else if (values.externalReferral) {
        if (values.externalReferralDetails) {
          str = values.memo
            ? `Referral letter to ${values.externalReferralDetails.doctorName} (${
                values.externalReferralDetails.address
              })`
            : '';
          values.str = str;
        }
      }
    });
  }

  onDelete(index) {
    console.log('delete index', index);
    this.itemsFormArray.removeAt(index);
  }
}
