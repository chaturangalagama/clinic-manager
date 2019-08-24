import { Location } from '@angular/common';
import { LoggerService } from './../../../services/logger.service';
import { ApiPatientVisitService } from './../../../services/api-patient-visit.service';
import { AlertService } from './../../../services/alert.service';
import { PatientRegistryListResponse } from './../../../objects/response/PatientRegistryListResponse';
import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-header-registry-content',
  templateUrl: './header-registry-content.component.html',
  styleUrls: ['./header-registry-content.component.scss']
})
export class HeaderRegistryContentComponent implements OnInit {
  @Output() dropdownStatus = new EventEmitter<boolean>();

  rows = [];
  pageLimit = 10;
  selectedRow: PatientRegistryListResponse;
  selectedIndex: number;

  ROUTE_1 = ['/pages/consultation/add', true];
  ROUTE_2 = ['/pages/consultation/add'];
  currentRoute = 'route1';

  constructor(
    private store: StoreService,
    private router: Router,
    private alertService: AlertService,
    private apiPatientVisitService: ApiPatientVisitService,
    private logger: LoggerService,
    private location: Location
  ) {}

  ngOnInit() {
    this.populateData();
    this.store.getHeaderRegistry().subscribe(
      res => {
        this.populateData();
      },
      err => {}
    );
  }

  onSelectionChange(event, index) {
    if (!event.checked) {
      console.log('ENTRY', event.patientId, index);
      this.selectedRow = event;
      this.selectedIndex = index;
    }
  }

  populateData() {
    const temp2 = [];
    let runningNumber = 0;

    if (this.store.patientRegistry && JSON.stringify(this.store.patientRegistry) !== JSON.stringify(this.rows)) {
      this.store.patientRegistry.map((payload, index) => {
        if (
          (payload.visitState === 'INITIAL' || payload.visitState === 'CONSULT') &&
          ((this.store.getUser().context['cms-user-id'] &&
            payload.doctorId === this.store.getUser().context['cms-user-id']) ||
            !payload.doctorId)
        ) {
          const tempPatient = {
            number: runningNumber,
            name: payload.name,
            patientId: payload.patientId,
            purpose: payload.purposeOfVisit,
            remarks: payload.remark,
            visitState: payload.visitState,
            patientRegistryId: payload.patientRegistryId,
            checked: false
          };
          this.logger.info('ttttt', tempPatient);
          temp2.push(tempPatient);
          runningNumber++;
        }
      });

      this.logger.info('aaaaa', temp2);
      this.rows = temp2;
    }
  }

  onNextPatient() {
    console.log('NEXT PATIENT');
    if (this.selectedRow && this.selectedRow.patientId) {
      //   const currPatient = this.selectedPatient;
      this.store.setPatientId(this.selectedRow.patientId);
      this.store.setPatientVisitRegistryId(this.selectedRow.patientRegistryId);

      //TODO: remove, not working
      console.log('SELECTED INDEX', this.selectedIndex);
      console.log('SELECTED ROW', this.rows[this.selectedIndex]);
      this.rows[this.selectedIndex]['checked'] = false;
      console.log('SELECTED ROWs', this.rows);
      console.log('SELECTED ROWs State', this.selectedRow.visitState);

      if (this.selectedRow.visitState === 'INITIAL') {
        this.apiPatientVisitService.consult(this.selectedRow.visitId, 'this.store').subscribe(
          resp => {
            if (resp.statusCode === 'S0000') {
              this.selectedRow = new PatientRegistryListResponse();
              // this.router.navigate(['/pages/consultation/add']);
              this.changeConsultRoute();
            } else {
              this.alertService.error(resp.message);
            }
          },
          err => {
            this.alertService.error(JSON.stringify(err.error.message));
          }
        );
      } else {
        this.alertService.error('IN');

        console.log('PRE ROUTE', this.store.currentConsultationRoute);
        this.changeConsultRoute();
        console.log('POST ROUTE', this.store.currentConsultationRoute);
      }
    }
    // clear current selection
    this.selectedRow = new PatientRegistryListResponse();
    this.dropdownStatus.emit(false);
  }

  changeConsultRoute() {
    if (this.store.currentConsultationRoute === 'route1') {
      this.store.currentConsultationRoute = 'route2';
      this.router.navigate(this.ROUTE_2);
    } else {
      this.store.currentConsultationRoute = 'route1';
      this.router.navigate(this.ROUTE_1);
    }
  }
}
