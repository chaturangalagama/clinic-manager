import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
import { NgxPermissionsService } from 'ngx-permissions';
import { StoreService } from '../../../../services/store.service';
import { AuthService } from '../../../../services/auth.service';
import { AlertService } from '../../../../services/alert.service';
import { ApiCaseManagerService } from '../../../../services/api-case-manager.service';
import moment = require('moment');
import { Page } from '../../../../model/page';
import { DISPLAY_DATE_TIME_NO_SECONDS_FORMAT, DB_FULL_DATE_FORMAT } from '../../../../constants/app.constants';

@Component({
  selector: 'app-case-manager-list',
  templateUrl: './case-manager-list.component.html',
  styleUrls: ['./case-manager-list.component.scss']
})
export class CaseManagerListComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableWrapper') tableWrapper;
  @ViewChild('containerFluid') container;

  rows = [];
  caseResponse = [];
  singleCaseResponse = {};
  endMinDate: Date;
  startDate: Date;
  endDate: Date;
  fromDate: string;
  toDate: string;
  caseIdValue: string;
  caseName: string;
  status: string;
  searchBody = {};
  page = new Page();

  columns = [
    { name: 'Date', flexGrow: 1 },
    { name: 'Case ID', flexGrow: 1 },
    { name: 'NRIC', flexGrow: 1 },
    { name: 'Name', flexGrow: 2 },
    { name: 'Amt Charged', flexGrow: 2 },
    { name: 'Amt Paid', flexGrow: 2 },
    { name: 'Amt Outstanding', flexGrow: 3 },
    { name: 'No of Visits', flexGrow: 2 },
    { name: 'Status', flexGrow: 1 },
    { name: 'Action', flexGrow: 1 }
  ];

  statusFilterDropdown = {
    value: [{ value: 'ALL', label: 'ALL' }, { value: 'OPEN', label: 'OPEN' }, { value: 'CLOSED', label: 'CLOSED' }]
  };

  mainFormGroup = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
    caseIdValue: new FormControl(),
    caseName: new FormControl(),
    status: new FormControl()
  });

  constructor(
    private permissionsService: NgxPermissionsService,
    private store: StoreService,
    private apiCaseManagerService: ApiCaseManagerService,
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

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
    this.setPage({ offset: 0 });
    this.subscribeChange();
  }

  setPage(pageInfo) {
    if (this.startDate) {
      this.fromDate = moment(this.startDate).format('DD-MM-YYYYT00:00:00');
    } else {
      this.fromDate = null;
    }

    if (this.endDate) {
      this.toDate = moment(this.endDate).format('DD-MM-YYYYT23:59:59');
    } else {
      this.toDate = null;
    }

    this.searchBody = {
      caseNumber: this.caseIdValue,
      name: this.caseName,
      status: this.status,
      fromDate: this.fromDate,
      toDate: this.toDate
    };

    this.page.pageNumber = pageInfo.offset;
    this.apiCaseManagerService.getCaseList(this.store.clinicId, this.searchBody, this.page).subscribe(
      pagedData => {
        console.log('Paging list', pagedData);
        if (pagedData) {
          const { payload } = pagedData;
          this.populateData(payload);
          this.page.pageNumber = pagedData['pageNumber'];
          this.page.totalPages = pagedData['totalPages'];
          this.page.totalElements = pagedData['totalElements'];
        }
        return pagedData;
      },
      err => {
        this.alertService.error(JSON.stringify(err.error.message));
      }
    );
  }

  getSearchedList() {
    this.setPage({ offset: 0 });
  }

  populateData(data) {
    this.caseResponse = data.map((payload, index) => {
      const tempCase = {
        date: moment(moment(payload.createdDate, DB_FULL_DATE_FORMAT)).format(DISPLAY_DATE_TIME_NO_SECONDS_FORMAT),
        caseId: payload.caseId,
        caseNumber: payload.caseNumber,
        nric: payload.patientNRIC,
        name: payload.patientName,
        salesOrder: payload.salesOrder,
        noOfVisits: payload.visitIds,
        status: payload.status,
        number: index + 1,
        patientId: payload.patientId
      };
      return tempCase;
    });
    this.rows = [];
    this.rows = this.caseResponse;
    console.log('Case List', this.rows);
  }

  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  caseManagerExpand() {
    const bodyClassList = document.querySelector('body').classList;

    if (
      bodyClassList.contains('sidebar-hidden') ||
      bodyClassList.contains('asidemenu-hidden') ||
      bodyClassList.contains('sidebar-minimized') ||
      bodyClassList.contains('brand-minimized')
    ) {
      return 'force';
    } else {
      return 'flex';
    }
  }

  subscribeChange() {
    this.mainFormGroup.valueChanges.subscribe(value => {
      console.log('Form Change', value);
      console.log('Form State', this.mainFormGroup.controls);
      console.log('isFormValid', this.mainFormGroup.valid);

      this.startDate = value.startDate;
      this.endDate = value.endDate;
      this.caseIdValue = value.caseIdValue;
      this.caseName = value.caseName;
      this.status = value.status;

      if (value.startDate) {
        this.endMinDate = value.startDate;
      }
    });
  }

  populateSingleData(data) {
    this.singleCaseResponse = {
      date: moment(moment(data.createdDate, 'DD-MM-YYYYT00:00:00')).format('DD-MM-YYYY'),
      caseId: data.caseId,
      nric: data.patientNRIC,
      name: data.patientName,
      salesOrder: data.salesOrder,
      noOfVisits: data.visitIds,
      status: data.status,
      patientId: data.patientId
    };
    this.rows = [];
    this.rows[0] = this.singleCaseResponse;
    console.log('searched case', this.rows[0]);
  }

  redirectToPatientDetail(patientId: string, name: string) {
    this.store.setPatientId(patientId);
    this.router.navigate(['/pages/patient/detail']);
    return false;
  }

  redirectToCaseDetail(caseId: string, patientId: string) {
    this.store.setCaseId(caseId);
    this.store.setPatientId(patientId);
    this.router.navigate(['/pages/case/detail']);
    return false;
  }
}
