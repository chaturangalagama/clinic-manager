// General Libraries
import { Subject } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';

// Services
import { StoreService } from '../../../../services/store.service';
import { AlertService } from '../../../../services/alert.service';
import { ApiPatientVisitService } from './../../../../services/api-patient-visit.service';

// Constants
import { DB_FULL_DATE_FORMAT } from '../../../../constants/app.constants';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss']
})
export class PatientProfileComponent implements OnInit {
  @Input() profileFormGroup: FormGroup;
  @Input() needRefresh: Subject<boolean>;
  @Input() patientInfo;

  // Input Variables to be passed down to sub-components
  visitHistory;
  vaccineInfo;

  constructor(
    private apiPatientVisitService: ApiPatientVisitService,
    private store: StoreService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.initHistoryList();

    this.subscribeOnChange();
  }

  subscribeOnChange() {
    // Listen for refresh
    this.needRefresh.subscribe(value => {
      console.log('profileFormGroup: ', this.profileFormGroup);
      this.initHistoryList();
    });
  }

  // Get Vaccination History List
  initHistoryList() {
    this.apiPatientVisitService.getPatientVisitHistory(this.store.getPatientId()).subscribe(
      res => {
        this.visitHistory = res.payload
          .filter(history => Object.keys(history).length)
          .filter(history => history.consultation)
          .sort((a, b) => {
            const momentA = moment(a.consultation.consultationStartTime, DB_FULL_DATE_FORMAT);
            const momentB = moment(b.consultation.consultationStartTime, DB_FULL_DATE_FORMAT);
            return momentB.diff(momentA);
          });
      },
      err => this.alertService.error(JSON.stringify(err))
    );
  }
}
