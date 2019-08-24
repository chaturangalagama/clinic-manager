import { UserRegistrationObject } from './../../../../objects/UserRegistrationObject';
import { ApiPatientInfoService } from './../../../../services/api-patient-info.service';
import { Component, Input, OnChanges, OnInit, SimpleChanges, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { timer } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { Allergy } from './../../../../objects/response/Allergy';
import { ALLERGY_TYPES, ALLERGIES, ALERT_TYPES, ALERT_PRIORITY } from './../../../../constants/app.constants';
import { MedicalAlertResponse } from './../../../../objects/response/MedicalAlertResponse';
import { StoreService } from './../../../../services/store.service';
import { PatientDetailTagAddAlertComponent } from './../../../patient-detail/patient-detail-tag/patient-detail-tag-add-alert/patient-detail-tag-add-alert.component';
import { PatientAddAlertsInfoAddClinicalComponent } from './../../../patient-add/patient-add-alerts-info/patient-add-alerts-info-add-clinical/patient-add-alerts-info-add-clinical.component';

import { DISPLAY_DATE_FORMAT } from '../../../../constants/app.constants';
import { UtilsService } from '../../../../services/utils.service';

@Component({
  selector: 'app-consultation-patient-alert-info',
  templateUrl: './consultation-patient-alert-info.component.html',
  styleUrls: ['./consultation-patient-alert-info.component.scss']
})
export class ConsultationPatientAlertInfoComponent implements OnInit, OnChanges {
  constructor(
    private store: StoreService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private apiPatientInfoService: ApiPatientInfoService,
    private utilsService: UtilsService
  ) {}

  @Input() alerts: Array<Allergy>;
  @Input() medicalAlerts: Array<MedicalAlertResponse>;
  @Input() patientInfo: UserRegistrationObject;
  alertFormGroup: FormGroup;
  medicalAlertFormGroup: FormGroup;
  bsModalRef: BsModalRef;

  // OPTIONS
  allergyTypes = [];
  allergyNames = [];
  medicalAlertTypes = [];
  medicalAlertPriorities = [];

  ngOnInit() {
    // console.log('PATIENT',this.store.getUser());

    this.allergyTypes = this.utilsService.mapToDisplayOptions(ALLERGY_TYPES);
    this.allergyNames = this.utilsService.mapToDisplayOptions(ALLERGIES);
    this.medicalAlertTypes = this.utilsService.mapToDisplayOptions(ALERT_TYPES);
    this.medicalAlertPriorities = this.utilsService.mapToDisplayOptions(ALERT_PRIORITY);

    if (this.alertFormGroup === undefined || this.medicalAlertFormGroup === undefined) {
      this.initAlertForm();
    }
    this.valueChange();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('this.alerts: ', this.alerts);
    console.log('--Changes--', changes);
    if (changes.alerts) {
      if (changes.alerts.currentValue) {
        this.alerts.map((value, index) => {
          (<FormArray>this.alertFormGroup.get('alertArray')).push(this.formatAlertArrayItem(value));
        });
        console.log('ngOnChanges: this.alerts: ', this.alerts);
      }
    }

    if (changes.medicalAlerts) {
      if (changes.medicalAlerts.currentValue) {
        this.medicalAlerts.map((value, index) => {
          (<FormArray>this.medicalAlertFormGroup.get('alertArray')).push(this.formatMedicalAlertArrayItem(value));
        });
        console.log('ngOnChanges: this.medicalAlerts: ', this.medicalAlerts);
      }
    } else {
      console.log('no changes in medical alerts');
    }
  }

  valueChange() {
    const alertArray = this.alertFormGroup.get('alertArray') as FormArray;
    const medicalAlertArray = this.medicalAlertFormGroup.get('alertArray') as FormArray;

    this.alertFormGroup.valueChanges
      .pipe(debounceTime(50), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(values => {
        console.log('new form values', values);
        if (values.isAdd) {
          this.alertFormGroup.patchValue({
            isAdd: false,
            requiredSave: true
          });
          alertArray.push(this.newAlertArrayItem());
        }

        if (values.requiredSave) {
          this.patientInfo.allergies = this.alerts;
          this.apiPatientInfoService.update(this.store.getPatientId(), this.patientInfo).subscribe(
            data => {
              if (data.payload) {
                this.alertFormGroup.patchValue({
                  requiredSave: false
                });

                console.log('Update Patient Info Result', data.payload);
              }
            },
            err => {
              console.log('Error updating Patient Info');
            }
          );
        }
      });

    this.medicalAlertFormGroup.valueChanges
      .pipe(debounceTime(50), distinctUntilChanged())
      .subscribe(values => {
        console.log('new form values', values);
        if (values.isAdd) {
          this.medicalAlertFormGroup.patchValue({
            isAdd: false
          });
          medicalAlertArray.push(this.newMedicalAlertArrayItem());
        }
        if (values.requiredSave) {
          this.medicalAlertFormGroup.patchValue({
            requiredSave: false
          });

          const addedMedicalAlerts: MedicalAlertResponse[] = [];

          // Add Medical Alerts ++
          this.medicalAlerts.map(medicalAlert => {
            if (
              medicalAlert.alertId === '' ||
              medicalAlert.alertId === undefined ||
              medicalAlert.alertId.length === 0
            ) {
              addedMedicalAlerts.push(medicalAlert);
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
      });
  }

  patchToMedicalAlertFormGroup(data) {
    const alertArray = this.medicalAlertFormGroup.get('alertArray') as FormArray;
    const alerts = [];

    data.map(alert => {
      if (alert.alertType != 'ALLERGY') {
        alerts.push(alert);
      }
    });


    alerts.map(alert => {
      this.formatMedicalAlertArrayItemToFormGroup(alert);
    });

    alertArray.patchValue(alerts);
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

  initAlertForm() {
    this.alertFormGroup = this.fb.group({
      alertArray: this.fb.array([]),
      state: '',
      isAdd: false,
      specialNotes: '',
      requiredSave: false
    });

    this.medicalAlertFormGroup = this.fb.group({
      alertArray: this.fb.array([]),
      trashArray: this.fb.array([]),
      state: '',
      isAdd: false,
      requiredSave: false
    });

    console.log('initAlertForm().this.medicalAlerts: ', this.medicalAlerts);
    console.log('initAlertForm().this.alerts: ', this.alerts);

    if (this.alerts && this.alerts.length > 0) {
      console.log('initAlertForm: this.alert is not empty');
      this.alerts.map((value, index) => {
        (<FormArray>this.alertFormGroup.get('alertArray')).push(this.formatAlertArrayItem(value));
      });
    } else {
      console.log('initAlertForm: this.alerts is  empty');
      // (<FormArray>this.alertFormGroup.get('alertArray')).push(this.newAlertArrayItem());
    }

    if (this.medicalAlerts && this.medicalAlerts.length > 0) {
      console.log('initAlertForm: this.medicalAlerts is not empty');
      this.medicalAlerts.map((value, index) => {
        (<FormArray>this.medicalAlertFormGroup.get('alertArray')).push(this.formatMedicalAlertArrayItem(value));
      });
    } else {
      console.log('initAlertForm: this.medicalAlerts is  empty');
      // (<FormArray>this.medicalAlertFormGroup.get('alertArray')).push(this.newAlertArrayItem());
    }
  }

  onAddAlert() {
    const initialState = {
      title: 'Allergy Information',
      alertFormGroup: this.alertFormGroup
    };

    this.bsModalRef = this.modalService.show(PatientDetailTagAddAlertComponent, {
      initialState,
      class: 'modal-lg',
      keyboard: false,
      backdrop: 'static'
    });

    this.bsModalRef.content.event.subscribe(data => {
      if (data) {
        console.log('Patient Allergy Data', data);
        // this.addPatientToRegistry(patientId, data);
      } else {
        console.log('No data emitted');
      }
      this.bsModalRef.content.event.unsubscribe();
      this.bsModalRef.hide();
    });
  }

  onAddMedicalAlert() {
    const initialState = {
      title: 'Clinical Alert Information',
      medicalAlertFormGroup: this.medicalAlertFormGroup
    };

    this.bsModalRef = this.modalService.show(PatientAddAlertsInfoAddClinicalComponent, {
      initialState,
      class: 'modal-lg',
      keyboard: false,
      backdrop: 'static'
    });

    if (this.bsModalRef.content.event) {
      this.bsModalRef.content.event.subscribe(data => {
        if (data) {
          console.log('Patient Allergy Data', data);
          // this.addPatientToRegistry(patientId, data);
        } else {
          console.log('No data emitted');
        }
        this.bsModalRef.content.event.unsubscribe();
        this.bsModalRef.hide();
      });
    }
  }

  subscribeAlertArrayItemValueChanges(item: FormGroup, values) {
    console.log('Item changed', values, item);
    if (values.isDelete) {
      this.alerts.splice(values.deleteIndex, 1);
      return;
    }

    const formArray = item.parent as FormArray;
    const index = formArray.value.map(value => JSON.stringify(value)).indexOf(JSON.stringify(values));
    const info = this.alerts[index];
    if (!info) {
      const updatedInfo = <any>{
        allergyType: values.type,
        name: values.name,
        remarks: values.remarks,
        addedDate: moment().format(DISPLAY_DATE_FORMAT)
      };
      this.alerts.push(updatedInfo);
    } else {
      info.allergyType = values.type;
      info.name = values.name;
      info.remarks = values.remarks;
    }
  }

  newAlertArrayItem() {
    const item = this.fb.group({
      types: { value: this.allergyTypes },
      type: ['', Validators.required],
      allergies: { value: this.allergyNames },
      name: ['', Validators.required],
      remarks: '',
      addedDate: moment().format(DISPLAY_DATE_FORMAT),

      isDelete: false,
      deleteIndex: -1
    });

    item.valueChanges
      .pipe(debounceTime(50), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(values => this.subscribeAlertArrayItemValueChanges(item, values));

    return item;
  }

  formatAlertArrayItem(allergy) {
    const item = this.fb.group({
      types: { value: this.allergyTypes },
      type: [allergy.allergyType, Validators.required],
      allergies: { value: this.allergyNames },
      name: [allergy.name, Validators.required],
      remarks: allergy.remarks,
      addedDate: allergy.addedDate,

      isDelete: false,
      deleteIndex: -1
    });

    item.valueChanges
      .pipe(debounceTime(50), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(values => this.subscribeAlertArrayItemValueChanges(item, values));

    return item;
  }

  newMedicalAlertArrayItem() {
    const item = this.fb.group({
      alertId: '',
      types: { value: this.medicalAlertTypes },
      type: '',
      name: ['', Validators.required],
      remark: '',
      priority: ['', Validators.required],
      priorityDropDown: { value: this.medicalAlertPriorities },
      isDelete: false,
      deleteIndex: -1,
      isEdit: true,
      requiredSave: false,
      addedDate: moment().format(DISPLAY_DATE_FORMAT),
      expiryDate: moment().format(DISPLAY_DATE_FORMAT)
    });

    item.valueChanges
      .pipe(debounceTime(50), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(values => this.subscribeMedicalArrayItemValueChanges(item, values));

    return item;
  }

  formatMedicalAlertArrayItem(medicalAlert) {
    const item = this.fb.group({
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
      requiredSave: false,
      addedDate: medicalAlert.addedDate,
      expiryDate: medicalAlert.expiryDate
    });

    item.valueChanges
      .pipe(debounceTime(50), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(values => this.subscribeMedicalArrayItemValueChanges(item, values));

    return item;
  }

  //Medical Alert
  subscribeMedicalArrayItemValueChanges(item: FormGroup, values) {
    const medicalAlertArray = this.medicalAlertFormGroup.get('alertArray') as FormArray;

    if (values.isDelete) {
      this.medicalAlerts.splice(values.deleteIndex, 1);
      return;
    }

    const formArray = item.parent as FormArray;
    const index = formArray.value.map(arr => JSON.stringify(arr)).indexOf(JSON.stringify(values));
    const info = this.medicalAlerts[index];
    if (!info) {
      const updatedInfo = <any>{
        alertId: values.alertId,
        alertType: values.type,
        name: values.name,
        remark: values.remark,
        priority: values.priority,
        addedDate: moment().format(DISPLAY_DATE_FORMAT),
        expiryDate: moment().format(DISPLAY_DATE_FORMAT)
      };
      this.medicalAlerts.push(updatedInfo);
    } else {
      info.alertId = values.alertId;
      info.alertType = values.type;
      info.name = values.name;
      info.remark = values.remark;
      info.priority = values.priority;
      // info.addedDate = moment(values.addedDate).format(DISPLAY_DATE_FORMAT);
      // info.expiryDate = moment(values.expiryDate).format(DISPLAY_DATE_FORMAT);
      info.addedDate = values.addedDate;
      info.expiryDate = values.expiryDate;
    }

    if (values.alertId) {
      item.get('isEdit').patchValue(false);
    }

  }

  addTagStyle(alertType: string): string {
    switch (alertType) {
      case 'ALLERGY':
        return 'badge-brand-secondary';
      case 'MEDICAL':
        return 'badge-yellow';

      default:
        return 'badge-brand-secondary';
    }
  }
}
