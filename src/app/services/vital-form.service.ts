import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

import { VitalData } from '../objects/request/VitalData';
import { DB_FULL_DATE_FORMAT_NO_SECOND } from './../constants/app.constants';
import { ApiPatientVisitService } from './api-patient-visit.service';
import { StoreService } from './store.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { VitalConfiguration } from '../objects/response/VitalConfiguration';

@Injectable({
  providedIn: 'root'
})
export class VitalFormService {
  private _vitalSignFormArray: FormArray;
  // private vitals: Array<VitalConfiguration>;
  private vitalData$ = new Subject<any>();
  private availableDataKeys$ = new Subject<VitalConfiguration[]>();
  private addVitalCompleted$: Subject<boolean>;

  constructor(
    private fb: FormBuilder,
    private store: StoreService,
    private apiPatientVisitService: ApiPatientVisitService
  ) {
    this.vitalSignFormArray = new FormArray([]);
    this.addVitalCompleted$ = new Subject<boolean>();
  }

  public getVitalData() {
    return this.vitalData$.asObservable();
  }

  public getavailableDataKeys() {
    return this.availableDataKeys$.asObservable();
  }

  public get vitalSignFormArray(): FormArray {
    return this._vitalSignFormArray;
  }
  public set vitalSignFormArray(value: FormArray) {
    this._vitalSignFormArray = value;
  }

  generateFormGroup(patientId?: string, code?: string) {
    return this.fb.group({
      patientId: patientId || '',
      code: code || '',
      value: this.fb.control({ value: '', disabled: code ? false : true }, [Validators.required]),
      comment: ''
    });
  }

  resetVitalSignFormArray() {
    this.vitalSignFormArray = this.fb.array([]);
  }

  fillFormGroup(data: VitalData) {
    const { patientId, code, value, comment } = data;
    return this.fb.group({ patientId: patientId || '', code: code || '', value: value || '', comment: comment || '' });
  }

  initFormArray() {
    if (!this.vitalSignFormArray) {
      this.vitalSignFormArray = this.fb.array([this.generateFormGroup()]);
    }

    return this.vitalSignFormArray;
  }

  addItem(vitalDataFormGroup?: FormGroup, patientId?: string, code?: string) {
    // Don't add after the length is the same as the configuration
    if (this.vitalSignFormArray.length === this.store.vitalConfigurations.length) {
      return;
    }

    // check whether form group is being passed in
    if (!vitalDataFormGroup) {
      vitalDataFormGroup = this.generateFormGroup(patientId, code);
    }

    if (!this.vitalSignFormArray) {
      this.vitalSignFormArray = this.fb.array([vitalDataFormGroup]);
    } else {
      this.vitalSignFormArray.push(vitalDataFormGroup);
    }
  }

  deleteItem(index: number) {
    if (!this.vitalSignFormArray || this.vitalSignFormArray.length < 1) {
      return;
    }

    this.vitalSignFormArray.removeAt(index);
  }

  initialVitalForm() {
    if (!this.vitalSignFormArray) {
      const tempVitalData = new VitalData();
      tempVitalData.code = 'weight';
      this.vitalSignFormArray = this.fb.array([this.fillFormGroup(tempVitalData)]);
      tempVitalData.code = 'height';
      this.vitalSignFormArray.push(this.fillFormGroup(tempVitalData));
    }
    return this.vitalSignFormArray;
  }

  getaddVitalCompleted() {
    return this.addVitalCompleted$.asObservable();
  }

  getInitialDateRange(): string[] {
    const startDate = moment()
      .subtract(30, 'days')
      .format(DB_FULL_DATE_FORMAT_NO_SECOND);
    const endDate = moment()
      .add(1, 'days')
      .format(DB_FULL_DATE_FORMAT_NO_SECOND);

    return [startDate, endDate];
  }

  getInitialDateRangeISO() {
    const startDate = moment()
      .subtract(30, 'days')
      .toDate();

    const endDate = moment()
      .add(1, 'days')
      .toDate();
    console.log('​VitalFormService -> getInitialDateRangeISO -> endDate', startDate, endDate);

    return [startDate, endDate];
  }

  getVitalInfo(code, dataKey) {
    const item = this.store.vitalConfigurations.find(val => val.code === code);
    return item[dataKey];
  }

  findVitalItem(code) {
    return this.store.vitalConfigurations.find(val => val.code === code);
  }

  populateData(_startDate?: string, _endDate?: string) {
    let startDate = '';
    startDate = _startDate ? _startDate : this.getInitialDateRange()[0];
    let endDate = '';
    endDate = _endDate ? _endDate : this.getInitialDateRange()[1];

    // this.apiPatientVisitService.listVital('5bf62ab3dbea1b39c2675ea7', startDate, endDate).subscribe(
    this.apiPatientVisitService.listVital(this.store.getPatientId(), startDate, endDate).subscribe(
      res => {
        if (res.payload) {
          console.log('​VitalFormService -> populateData -> res.payload', res.payload);

          const keys = Object.keys(res.payload);
          const data = keys.map(_data => this.store.vitalConfigurations.find(value => value.code === _data));

          // this.availableDataKeys$.next(Object.keys(res.payload));
          this.availableDataKeys$.next(data);
          this.vitalData$.next(res.payload);
        }
      },
      err => {}
    );
  }

  saveVital() {
    let vitalData = this.vitalSignFormArray.value;

    vitalData = vitalData.filter(data => data.code && data.value);

    this.apiPatientVisitService.addVitalList(vitalData).subscribe(
      res => {
        this.addVitalCompleted$.next(true);
      },

      err => {
        this.addVitalCompleted$.next(false);
      }
    );
  }
}
