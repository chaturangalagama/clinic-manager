import { ALERT_TYPES } from './../../../constants/app.constants';
import { PatientAddAlertsInfoAddClinicalComponent } from './patient-add-alerts-info-add-clinical/patient-add-alerts-info-add-clinical.component';
import { PatientAddAlertsInfoAddAllergyComponent } from './patient-add-alerts-info-add-allergy/patient-add-alerts-info-add-allergy/patient-add-alerts-info-add-allergy.component';
import { Component, OnInit, Input, EventEmitter } from '@angular/core';

import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PatientService } from '../../../services/patient.service';

import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-patient-add-alerts-info',
  templateUrl: './patient-add-alerts-info.component.html',
  styleUrls: ['./patient-add-alerts-info.component.scss']
})
export class PatientAddAlertsInfoComponent implements OnInit {
  @Input() alertFormGroup: FormGroup;
  @Input() medicalAlertFormGroup: FormGroup;

  bsModalRef: BsModalRef;
  public e: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: BsModalService, private patientService: PatientService, private fb: FormBuilder) {}

  ngOnInit() {
    console.log('medical alert: ', this.medicalAlertFormGroup);
    this.subscribeValueChanges();
  }

  addAllergy() {
    const initialState = {
      title: 'Show Allergies',
      alertFormGroup: this.alertFormGroup
    };

    this.modalService.show(PatientAddAlertsInfoAddAllergyComponent, {
      initialState,
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    });
  }

  addMedicalAlerts() {
    const initialState = {
      title: 'Clinical Alert Information',
      medicalAlertFormGroup: this.medicalAlertFormGroup
    };

    this.modalService.show(PatientAddAlertsInfoAddClinicalComponent, {
      initialState,
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    });
  }

  addTagStyle(alertType: string): string {
    switch (alertType) {
      case 'ALLERGY':
        return 'badge-pink';
      case 'MEDICAL':
        return 'badge-yellow';

      default:
        return 'badge-pink';
    }
  }

  newAlertArrayItem() {
    const types = ALERT_TYPES.map(data => {
      return {
        value: data,
        label: data
      };
    });
    const allergies = ['nut allergy', 'egg allergy', 'other allergy', 'unknown allergy'].map(data => {
      return {
        value: data,
        label: data
      };
    });

    const item = this.fb.group({
      types: { value: types },
      type: '',
      allergies: { value: allergies },
      name: '',
      remark: '',

      isDelete: false,
      deleteIndex: -1,

      isEdit: true
    });

    item.valueChanges
      .pipe(debounceTime(50), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(values => console.log(values));

    return item;
  }

  subscribeValueChanges() {
    const alertArray = this.alertFormGroup.get('alertArray') as FormArray;

    this.alertFormGroup.valueChanges
      .pipe(debounceTime(50), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(values => {
        if (values.isAdd) {
          this.alertFormGroup.patchValue({
            isAdd: false
          });
          alertArray.push(this.newAlertArrayItem());
        }
      });

    const medicalAlertArray = this.medicalAlertFormGroup.get('alertArray') as FormArray;

    this.medicalAlertFormGroup.valueChanges
      .pipe(debounceTime(50), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(values => {
        if (values.isAdd) {
          this.medicalAlertFormGroup.patchValue({
            isAdd: false
          });
          medicalAlertArray.push(this.newAlertArrayItem());
        }
      });

    console.log('medical form group: ', this.medicalAlertFormGroup);
  }

  formatAlertArrayItem(allergy) {
    console.log('Entering Format Alert Array item with allergy:', allergy);
    const types = ALERT_TYPES.map(data => {
      return {
        value: data,
        label: data
      };
    });

    const allergies = ['nut allergy', 'egg allergy', 'other allergy', 'unknown allergy'].map(data => {
      return {
        value: data,
        label: data
      };
    });

    const item = this.fb.group({
      types: { value: types },
      type: allergy.allergyType,
      allergies: { value: allergies },
      name: allergy.name,
      remarks: allergy.remarks,

      isDelete: false,
      deleteIndex: -1,

      isEdit: true
    });

    item.valueChanges
      .pipe(debounceTime(50), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(values => console.log('Initializing  allergies', allergies));

    return item;
  }
}
