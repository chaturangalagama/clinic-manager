import { Component, OnInit, EventEmitter } from '@angular/core';
import { ApiPatientVisitService } from '../../../services/api-patient-visit.service';
import { StoreService } from '../../../services/store.service';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import moment = require('moment');
import { BsModalRef } from 'ngx-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { DISPLAY_DATE_FORMAT, DB_VISIT_DATE_FORMAT } from '../../../constants/app.constants';

@Component({
  selector: 'app-case-manager-attach-visit',
  templateUrl: './case-manager-attach-visit.component.html',
  styleUrls: ['./case-manager-attach-visit.component.scss']
})
export class CaseManagerAttachVisitComponent implements OnInit {
  rows = [];
  fromDate: string;
  startDate: Date;
  patientId: string;
  selected = [];
  visitIds = [];
  title: string;
  public event: EventEmitter<any> = new EventEmitter();

  columns = [
    { name: 'Date', flexGrow: 1 },
    { name: 'Purpose', flexGrow: 1 },
    { name: 'Existing Case ID', flexGrow: 1 }
  ];
  visitResponse: any;

  constructor(
    private store: StoreService,
    private alertService: AlertService,
    private apiPatientVisitService: ApiPatientVisitService,
    private authService: AuthService,
    private router: Router,
    private bsModalRef: BsModalRef
  ) {}

  ngOnInit() {
    if (
      localStorage.getItem('access_token') &&
      localStorage.getItem('clinicCode') &&
      localStorage.getItem('clinicId')
    ) {
      this.store.clinicCode = localStorage.getItem('clinicCode');
      this.store.clinicId = localStorage.getItem('clinicId');
    } else {
      alert('Clinic is not selected.');
      localStorage.removeItem('access_token');
      this.authService.logout();

      console.log('Access Denied');
      this.router.navigate(['login']);
    }

    if (this.store.errorMessages.length > 0) {
      this.store.errorMessages.forEach(errorMsg1 => {
        console.log('ERROR MESSAGE: ', errorMsg1);
      });
    }
    this.subscribeChange();
  }

  mainFormGroup = new FormGroup({
    startDate: new FormControl()
  });

  setPage() {
    this.apiPatientVisitService.patientVisitList(this.patientId, this.fromDate, this.store.getCaseId()).subscribe(
      data => {
        console.log('Visit list', data);
        if (data) {
          const { payload } = data;
          this.populateData(payload);
        }
        return data;
      },
      err => {
        this.alertService.error(JSON.stringify(err.error.message));
      }
    );
  }

  populateData(data) {
    this.visitResponse = data.map((payload, index) => {
      const tempVisit = {
        visitId: payload.visitId,
        date: moment(moment(payload.startTime, DB_VISIT_DATE_FORMAT)).format('DD-MM-YYYY'),
        purpose: payload.visitPurpose,
        existingCaseId: payload.caseNumber
      };
      return tempVisit;
    });
    this.rows = this.visitResponse;
    console.log('Visit List', this.rows);
  }

  cancelModal() {
    this.bsModalRef.hide();
  }

  subscribeChange() {
    this.mainFormGroup.valueChanges.subscribe(value => {
      this.startDate = value.startDate;
    });
  }

  showVisits() {
    console.log('DATE', this.startDate);
    if (this.startDate) {
      this.fromDate = moment(this.startDate).format('01-MM-YYYYT00:00:00');
    } else {
      this.fromDate = null;
    }
    this.setPage();
  }

  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }

  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);

    this.visitIds = [];
    selected.forEach(element => {
      this.visitIds.push(element['visitId']);
    });
  }

  attachToThisCase() {
    console.log('Attaching cases ', this.visitIds);

    this.apiPatientVisitService.patientVisitAttach(this.store.getCaseId(), this.visitIds).subscribe(
      data => {
        if (data.statusCode === 'S0000') {
          this.event.emit('Refresh Case Details');
          this.cancelModal();
        } else {
          alert(data.message);
        }
      },
      err => {
        this.alertService.error(JSON.stringify(err.error.message));
      }
    );
  }
}
