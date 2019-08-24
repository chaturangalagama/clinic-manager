import { StoreService } from './store.service';
import { ApiPatientVisitService } from './api-patient-visit.service';
import { AlertService } from './alert.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from '../../../node_modules/rxjs';
import moment = require('moment');
import { DB_FULL_DATE_FORMAT_NO_SECOND } from '../constants/app.constants';

@Injectable()
export class VitalService {
  private vitalData = new BehaviorSubject<any>(undefined);

  constructor(
    private alertService: AlertService,
    private apiPatientVisitService: ApiPatientVisitService,
    private store: StoreService
  ) {}

  getPastVitals() {
    // this.vitalData = new BehaviorSubject<any>();
    //   this.apiPatientVisitService.listVital(this.store.getPatientId()).subscribe(
    //     data => {
    //       console.log('VITALS', data);
    //       if (data) {
    //         // this.vitalData = data.payload;
    //         // this.vitalData$ = Observable.of(data.payload);
    //         // this.vitalData$.next();
    //         this.vitalData.next(data.payload);
    //       }
    //     },
    //     err => this.alertService.error(JSON.stringify(err))
    //   );
  }

  getObservableVitalData() {
    return this.vitalData.asObservable();
  }

  resetVitalData() {
    this.vitalData = new BehaviorSubject<any>(undefined);
  }
}
