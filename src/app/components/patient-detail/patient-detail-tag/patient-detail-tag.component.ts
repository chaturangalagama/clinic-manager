import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { timer } from 'rxjs';
import { PATIENT_INFO_KEYS, ALERT_TYPES, ALERT_PRIORITY } from './../../../constants/app.constants';
import { ApiPatientInfoService } from './../../../services/api-patient-info.service';
import { AlertService } from './../../../services/alert.service';
import { StoreService } from '../../../services/store.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { PatientDetailTagAddAlertComponent } from './patient-detail-tag-add-alert/patient-detail-tag-add-alert.component';
import { PatientAddAlertsInfoAddClinicalComponent } from './../../patient-add/patient-add-alerts-info/patient-add-alerts-info-add-clinical/patient-add-alerts-info-add-clinical.component';

@Component({
  selector: 'app-patient-detail-tag',
  templateUrl: './patient-detail-tag.component.html',
  styleUrls: ['./patient-detail-tag.component.scss']
})
export class PatientDetailTagComponent implements OnInit {
  @Input() alertFormGroup: FormGroup;
  @Input() medicalAlertFormGroup: FormGroup;
  @Input() patientInfo: FormGroup;
  bsModalRef: BsModalRef;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private apiPatientInfoService: ApiPatientInfoService,
    private alertService: AlertService,
    private store: StoreService
  ) {}

  ngOnInit() {
    this.subscribeValueChanges();
  }

  addAllergy() {
    const initialState = {
      title: 'Allergy Information',
      alertFormGroup: this.alertFormGroup
    };
    this.bsModalRef = this.modalService.show(PatientDetailTagAddAlertComponent, {
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

    this.bsModalRef = this.modalService.show(PatientAddAlertsInfoAddClinicalComponent, {
      initialState,
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    });
  }

  addTagStyle(alertType: string): string {
    switch (alertType) {
      case 'ALLERGY':
        // return 'badge-pink';
        return 'badge-brand-secondary';
      case 'MEDICAL':
        return 'badge-yellow';
      default:
        // return 'badge-pink';
        return 'badge-brand-secondary';
    }
  }

  subscribeValueChanges() {
    this.alertFormGroup.valueChanges
      .pipe(debounceTime(50), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(values => {
        if (values.requiredSave) {
          console.log('REQUIRE SAVE, RUN UPDATE');
          this.updateAllergies();
          this.alertFormGroup.get('requiredSave').patchValue(false);
        }
      });

    this.medicalAlertFormGroup.valueChanges
      .pipe(debounceTime(50), distinctUntilChanged())
      .subscribe(values => {
        if (values.requiredSave) {
          this.updateMedicalAlerts(values);
          this.medicalAlertFormGroup.get('requiredSave').patchValue(false);
        }
      });
  }

  updateAllergies() {
    const user = this.pick(this.patientInfo, PATIENT_INFO_KEYS);

    this.apiPatientInfoService.update(this.store.getPatientId(), user).subscribe(
      res => {
        console.log('successfully added allergies');
      },
      err => this.alertService.error(JSON.stringify(err))
    );
  }

  updateMedicalAlerts(medicalAlertArray) {
    const addedMedicalAlerts = [];

    // Add Medical Alerts ++
    medicalAlertArray.alertArray.map(medicalAlert => {
      if (medicalAlert.alertId === '' || medicalAlert.alertId === undefined || medicalAlert.alertId.length === 0) {
        addedMedicalAlerts.push(this.formatMedicalAlertArrayItem(medicalAlert));
      } else {
        console.log('already mapped', medicalAlert.alertId);
      }
    });

    // Delete Medical Alerts --
    const medicalTrashArray = this.medicalAlertFormGroup.get('trashArray') as FormArray;
    const tempArray = [];
    if (medicalTrashArray.value.length > 0) {
      for (let i = 0; i < medicalTrashArray.value.length; i++) {
        if (
          medicalTrashArray.value[i]['value'].alertId !== undefined ||
          medicalTrashArray.value[i]['value'].alertId !== ''
        ) {
          tempArray.push(medicalTrashArray.value[i]['value'].alertId);
        }
      }
    }
    this.apiPatientInfoService.updateAlerts(this.store.getPatientId(), addedMedicalAlerts, tempArray);

    const source = timer(500);

    const subscribe = source.subscribe(val => {
      this.apiPatientInfoService.listAlert(this.store.getPatientId()).subscribe(data => {
        this.patchToMedicalAlertFormGroup(data.payload.details);
      });
    });
  }

  patchToMedicalAlertFormGroup(data) {
    const alertArray = this.medicalAlertFormGroup.get('alertArray') as FormArray;
    const alerts = [];

    console.log('alertArray: ', data);

    data.map(alert => {
      if (alert.alertType != 'ALLERGY') {
        alerts.push(alert);
      }
    });

    console.log('pushed alerts: ', alerts);

    alerts.map(alert => {
      this.formatMedicalAlertArrayItemToFormGroup(alert);
    });

    alertArray.patchValue(alerts);
    console.log('formatted to formgroup: ', alertArray);
  }

  formatMedicalAlertArrayItem(medicalAlert) {
    const formattedMedicalItem = {
      alertType: medicalAlert.type,
      name: medicalAlert.name,
      remark: medicalAlert.remark,
      priority: medicalAlert.priority,
      addedDate: medicalAlert.addedDate,
      expiryDate: medicalAlert.expiryDate
    };

    return formattedMedicalItem;
  }

  formatMedicalAlertArrayItemToFormGroup(medicalAlert) {
    const formattedMedicalItem = this.fb.group({
      alertId: medicalAlert.alertId,
      types: { value: ALERT_TYPES },
      type: medicalAlert.alertType,
      name: medicalAlert.name,
      remark: medicalAlert.remark,
      priority: medicalAlert.priority,
      priorityDropDown: { value: ALERT_PRIORITY },
      isDelete: false,
      deleteIndex: -1,
      isEdit: false,
      addedDate: medicalAlert.addedDate,
      expiryDate: medicalAlert.expiryDate
    });

    console.log('formatted item: ', formattedMedicalItem);
    return formattedMedicalItem;
  }

  pick(obj: Object, keys): Object {
    return Object.keys(obj)
      .filter(key => keys.includes(key))
      .reduce((pickedObj, key) => {
        pickedObj[key] = obj[key];
        return pickedObj;
      }, {});
  }
}
