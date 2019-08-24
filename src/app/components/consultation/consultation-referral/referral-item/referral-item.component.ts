import { debounceTime } from 'rxjs/operators';
import { StoreService } from './../../../../services/store.service';
import { LoggerService } from './../../../../services/logger.service';
import { DB_FULL_DATE_FORMAT } from './../../../../constants/app.constants';
import { Practice } from './../../../../objects/SpecialityByClinic';
import { FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as moment from 'moment';
import { UtilsService } from '../../../../services/utils.service';

@Component({
  selector: 'app-referral-item',
  templateUrl: './referral-item.component.html',
  styleUrls: ['./referral-item.component.scss']
})
export class ReferralItemComponent implements OnInit {
  @Input() referralItem: FormGroup;
  @Output() onDelete = new EventEmitter<number>();
  @Input() index: number;

  ckeConfig: any;

  isExternalReferral: false;
  practices = [];
  clinics = [];
  doctors = [];

  clinic: any;

  referralType = 'INTERNAL';

  referralTypes = [{ value: 'INTERNAL', label: 'INTERNAL' }, { value: 'EXTERNAL', label: 'EXTERNAL' }];

  constructor(private logger: LoggerService, private store: StoreService, private utilService: UtilsService) {}

  ngOnInit() {
    this.ckeConfig = {
      allowedContent: true,
      extraPlugins: 'divarea'
    };

    this.practices = this.store.specialitiesList.map(speciality => {
      return {
        label: this.utilService.convertToTitleCase(speciality.practice),
        practice: speciality.practice,
        clinics: speciality.clinics
      };
    });

    this.referralItem.get('appointmentDateTime').patchValue(moment(new Date()).format(DB_FULL_DATE_FORMAT));

    this.populateFormValues();

    this.subscribeChanges();
  }

  subscribeChanges() {
    this.referralItem.valueChanges.pipe(debounceTime(200)).subscribe(value => {
      this.isExternalReferral = value.externalReferral;
      this.setMandatoryFields();
    });
  }

  populateFormValues() {
    const doctorId = this.referralItem.get('doctorId');
    const clinicId = this.referralItem.get('clinicId');
    const practice = this.referralItem.get('practice');

    const externalReferral = this.referralItem.get('externalReferral').value;

    const externalReferralDetails = this.referralItem.get('externalReferralDetails');
    const externalReferralDoctor = this.referralItem.get('externalReferralDetails').get('doctorName');
    const externalReferralAddress = this.referralItem.get('externalReferralDetails').get('address');

    if (externalReferral) {
      this.referralType = 'EXTERNAL';
      doctorId.disable();
      clinicId.disable();

      externalReferralDetails.enable();
      doctorId.patchValue('');
      clinicId.patchValue('');

      practice.setValidators(Validators.required);
      practice.markAsTouched();
    } else {
      this.referralType = 'INTERNAL';
      doctorId.enable();
      clinicId.enable();
      practice.enable();

      externalReferralDoctor.setValidators(null);
      externalReferralDoctor.markAsTouched();

      externalReferralDoctor.patchValue('');
      externalReferralAddress.patchValue('');
      externalReferralDetails.disable();
    }

    if (this.referralItem.get('doctorId').value && this.referralItem.get('clinicId').value) {
      const practise = this.referralItem.get('practice').value;
      const doctor = this.referralItem.get('doctorId').value;
      const clinic = this.referralItem.get('clinicId').value;

      const practiceSelected = this.practices.find(function(x) {
        return x.practice === practise;
      });

      const clinicSelected = practiceSelected.clinics.find(function(x) {
        return x.clinicId === clinic;
      });

      this.populateClinic(practiceSelected.clinics);
      this.populateDoctor(clinicSelected.doctors);
    }
  }

  populatePractice(data: Practice[]) {
    this.practices = data;
  }

  populateClinic(data) {
    this.clinics = data;
  }

  populateDoctor(data) {
    this.doctors = data;
  }

  onPracticeSelected(option) {
    console.log('option:', option);
    if (option) {
      // clear doctor and clinic dropdown
      this.logger.info(option);
      this.referralItem.get('doctorId').patchValue('');
      this.doctors = [];
      this.referralItem.get('clinicId').patchValue('');

      this.populateClinic(option.clinics);

      this.setMandatoryFields();
    } else {
      this.referralItem.get('doctorId').patchValue('');
      this.referralItem.get('clinicId').patchValue('');
      this.clinics = [];
      this.doctors = [];
    }
  }

  onClinicSelected(option) {
    // clear doctor dropdown
    if (option) {
      this.referralItem.get('doctorId').patchValue('');

      this.populateDoctor(option.doctors);
      this.setMemoAsMandatory();
    } else {
      this.referralItem.get('doctorId').patchValue('');
      this.doctors = [];
    }
  }

  onDoctorSelected(option) {}

  onReferralTypeSelected(option) {
    if (this.referralType === 'INTERNAL') {
      this.referralItem.get('externalReferral').patchValue(false);
    } else if (this.referralType === 'EXTERNAL') {
      this.referralItem.get('externalReferral').patchValue(true);
    }

    this.referralItem.get('externalReferral').updateValueAndValidity();
  }

  setMemoAsMandatory() {
    this.referralItem.get('memo').setValidators([Validators.required]);
    this.referralItem.get('memo').markAsTouched();
    this.referralItem.get('memo').updateValueAndValidity();
  }

  setMemoAsNotMandatory() {
    // need to check other ng-select are empty also
    if (
      (!this.referralItem.get('clinicId').value || this.referralItem.get('clinicId').value === '') &&
      (!this.referralItem.get('practice').value || this.referralItem.get('practice').value === '') &&
      (!this.referralItem.get('doctorId').value || this.referralItem.get('doctorId').value === '')
    ) {
      this.referralItem.get('memo').clearValidators();
      this.referralItem.get('memo').updateValueAndValidity();
    }
  }

  setMandatoryFields() {
    const doctorId = this.referralItem.get('doctorId');
    const clinicId = this.referralItem.get('clinicId');
    const practice = this.referralItem.get('practice');
    const memo = this.referralItem.get('memo');
    const externalReferral = this.referralItem.get('externalReferral').value;
    const externalReferralDoctor = this.referralItem.get('externalReferralDetails').get('doctorName');
    const externalReferralAddress = this.referralItem.get('externalReferralDetails').get('address');

    if (
      externalReferralAddress.value ||
      externalReferralDoctor.value ||
      practice.value ||
      doctorId.value ||
      practice.value ||
      memo.value
    ) {
      practice.setValidators([Validators.required]);
      practice.markAsTouched();
      practice.updateValueAndValidity({ emitEvent: false });
    } else {
      practice.setValidators(null);
      practice.markAsTouched();
      practice.updateValueAndValidity({ emitEvent: false });
    }

    if (!externalReferral) {
      //  DISABLE EXTERNAL REFERRAL COMPONENTS
      externalReferralDoctor.disable({ emitEvent: false });
      externalReferralAddress.disable({ emitEvent: false });
      //  ENABLE INTERNAL REFERRAL COMPONENTS
      clinicId.enable({ emitEvent: false });
      doctorId.enable({ emitEvent: false });

      if (clinicId.value || doctorId.value || practice.value || memo.value) {
        clinicId.setValidators([Validators.required]);
        clinicId.markAsTouched();
        clinicId.updateValueAndValidity({ emitEvent: false });

        doctorId.setValidators([Validators.required]);
        doctorId.markAsTouched();
        doctorId.updateValueAndValidity({ emitEvent: false });
      } else {
        clinicId.setValidators(null);
        clinicId.markAsTouched();
        clinicId.updateValueAndValidity({ emitEvent: false });

        doctorId.setValidators(null);
        doctorId.markAsTouched();
        doctorId.updateValueAndValidity({ emitEvent: false });
      }
    } else {
      // ENABLE EXTERNAL REFERRAL COMPONENTS
      externalReferralDoctor.enable({ emitEvent: false });
      externalReferralAddress.enable({ emitEvent: false });
      //  DISABLE INTERNAL REFERRAL COMPONENTS
      clinicId.disable({ emitEvent: false });
      doctorId.disable({ emitEvent: false });
      if (externalReferralAddress.value || externalReferralDoctor.value || practice.value || memo.value) {
        externalReferralDoctor.setValidators([Validators.required]);
        externalReferralDoctor.markAsTouched();
        externalReferralDoctor.updateValueAndValidity({ emitEvent: false });

        externalReferralAddress.setValidators([Validators.required]);
        externalReferralAddress.markAsTouched();
        externalReferralAddress.updateValueAndValidity({ emitEvent: false });
      } else {
        externalReferralDoctor.setValidators(null);
        externalReferralDoctor.markAsTouched();
        externalReferralDoctor.updateValueAndValidity({ emitEvent: false });

        externalReferralAddress.setValidators(null);
        externalReferralAddress.markAsTouched();
        externalReferralAddress.updateValueAndValidity({ emitEvent: false });
      }
    }
    if (
      externalReferralAddress.value ||
      externalReferralDoctor.value ||
      practice.value ||
      doctorId.value ||
      clinicId.value
    ) {
      memo.setValidators([Validators.required]);
      memo.markAsTouched();
      memo.updateValueAndValidity({ emitEvent: false });
    } else {
      memo.setValidators(null);
      memo.markAsTouched();
      memo.updateValueAndValidity({ emitEvent: false });
    }
  }

  onbtnDeleteClicked() {
    console.log('emit delete', this.index);
    this.onDelete.emit(this.index);
  }
}
