import { ApiCaseManagerService } from './../../../../services/api-case-manager.service';
import {
  PATIENT_LIST_TABLE_CONFIG,
  PATIENT_LIST_ENTRY_COUNTS_DROPDOWN,
  PATIENT_STATUSES,
  PATIENT_LIST_ACTION_LIST_DROPDROWN
} from './../../../../constants/app.constants';
// General Libraries
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { FormBuilder, FormArray } from '@angular/forms';
import * as moment from 'moment';

// Services
import { AlertService } from './../../../../services/alert.service';
import { ConsultationFormService } from './../../../../services/consultation-form.service';
import { LoggerService } from './../../../../services/logger.service';
import { StoreService } from './../../../../services/store.service';
import { AuthService } from '../../../../services/auth.service';
import { PaymentService } from './../../../../services/payment.service';
import { ApiPatientVisitService } from '../../../../services/api-patient-visit.service';

// Objects
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { DB_FULL_DATE_FORMAT, INPUT_DELAY } from './../../../../constants/app.constants';

//Components
import { PatientAddQueueConfirmationComponent } from './../../../../components/patient-add/patient-add-queue-confirmation/patient-add-queue-confirmation.component';
import { VitalSignComponent } from './../../../../components/consultation/vital/vital-sign/vital-sign.component';

import { VitalAddComponent } from '../../../../components/vital/vital-add/vital-add.component';
import { VitalFormService } from '../../../../services/vital-form.service';
@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableWrapper') tableWrapper;
  @ViewChild('containerFluid') container;

  rows = [];
  columns = PATIENT_LIST_TABLE_CONFIG;
  originalRowData = [];
  // filterOptions: SearchFilter[] = [];
  filterOptions = [];
  pageLimit = 25;

  error: string;

  // Field dropdown options
  numberOfEntriesDropdown = {
    value: PATIENT_LIST_ENTRY_COUNTS_DROPDOWN
  };
  statusFilterDropdown = PATIENT_STATUSES;
  doctorsFilterDropdown = [];
  actionList = PATIENT_LIST_ACTION_LIST_DROPDROWN;

  selectedAction: string;
  bsModalRef: BsModalRef;
  confirmationBsModalRef: BsModalRef;

  constructor(
    private permissionsService: NgxPermissionsService,
    private router: Router,
    private store: StoreService,
    private apiPatientVisitService: ApiPatientVisitService,
    private apiCaseManagerService: ApiCaseManagerService,
    private alertService: AlertService,
    private eRef: ElementRef,
    private logger: LoggerService,
    private modalService: BsModalService,
    private consultationFormService: ConsultationFormService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private fb: FormBuilder,
    private vitalFormService: VitalFormService
  ) {}

  ngOnInit() {
    this.checkForCookies();
    this.customiseBodyBackgroundColor();
    this.getPatientRegistryList();

    this.store.getHeaderRegistry().subscribe(res => {
      // if (this.permissionsService.getPermission('ROLE_DOCTOR') && !this.permissionsService.getPermission('ROLE_CA')) {
      //   console.log('Populate Doctor View');
      //   this.populateDocData(null);
      // } else {
      // this.rows = this.temp2;
      this.populateData(null);
      // }
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.destroyBodyBackgroundColor();
  }

  ngAfterViewChecked() {
    const bodyClassList = document.querySelector('body').classList;

    if (
      bodyClassList.contains('sidebar-hidden') ||
      bodyClassList.contains('asidemenu-hidden') ||
      bodyClassList.contains('sidebar-minimized') ||
      bodyClassList.contains('brand-minimized')
    ) {
      // this.currentComponentWidth = this.container.nativeElement.clientWidth;
      this.table.columnMode = ColumnMode.force;
      this.table.recalculate();
      const evt = window.document.createEvent('UIEvents');
      evt.initUIEvent('click', true, false, window, 0);
      window.dispatchEvent(evt);

      // console.log('this.table: ', this.table);
    } else {
      this.table.columnMode = ColumnMode.flex;
      const evt = window.document.createEvent('UIEvents');
      evt.initUIEvent('click', true, false, window, 0);
      window.dispatchEvent(evt);

      this.table.recalculate();
    }
  }

  getPatientRegistryList() {
    this.apiPatientVisitService
      .patientRegistryListWithStartTime(
        this.store.clinicId,
        moment()
          .startOf('day')
          .format(DB_FULL_DATE_FORMAT),
        moment()
          .endOf('day')
          .format(DB_FULL_DATE_FORMAT)
      )
      .pipe(
        distinctUntilChanged(),
        debounceTime(INPUT_DELAY)
      )
      .subscribe(
        data => {
          if (data) {
            const { payload } = data;
            this.populateData(payload);
            this.doctorsFilterDropdown = this.getDoctorsOnDuty();
          }
          return data;
        },
        err => {
          this.alertService.error(JSON.stringify(err.error.message));
        }
      );
  }

  populateData(data) {
    if (
      (this.store.patientRegistry && JSON.stringify(this.store.patientRegistry) !== JSON.stringify(this.rows)) ||
      data
    ) {
      const dataToBeProcess = data ? data : this.store.patientRegistry;

      this.originalRowData = dataToBeProcess.map((payload, index) => {
        // console.log("DOCTOR LIST: ", this.store.doctorList);
        const entity = payload.registryEntity;
        const doctor = this.store.doctorList
          ? this.store.doctorList.find(x => {
              if (x.id === entity.preferredDoctorId) {
                return x;
              }
            })
          : '';

        const d = doctor ? doctor.displayName : '';
        // console.log("PAYLOAD: ", payload);

        const tempPatient = {
          action: payload.action,
          patientId: entity.patientId,
          patientRegistryId: payload.patientRegistryId,
          consultationId: payload.consultationId,
          visitId: entity.visitId,
          doctorId: entity.preferredDoctorId,
          status: entity.visitStatus,
          number: index + 1,
          visitNumber: entity.visitNumber,
          name: payload.patientName,
          nric: payload.userId['number'],
          time: entity.startTime,
          caseId: entity.caseId,
          doctor: d,
          purpose: entity.visitPurpose,
          remarks: payload.remark
        };
        return tempPatient;
      });

      //this.originalRowData = this.filterSearch(this.filterOptions, this.filterOptions.length - 1, this.originalRowData);
      // console.log('​populateData -> this.temp2', this.originalRowData);

      // this.rows = this.filterSearch(this.filterOptions, this.filterOptions.length - 1, this.originalRowData);
      // this.rows = this.multipleFilters(this.originalRowData, this.filterOptions);
      this.doFilter();
      this.doctorsFilterDropdown = this.store.patientRegistry && this.getDoctorsOnDuty();
    }
  }

  getDoctorsOnDuty() {
    const doctorMap = this.store.doctorList.reduce((map, obj) => {
      map[obj.id] = obj.name;
      return map;
    }, {});

    if (this.store.clinic && this.store.clinic.attendingDoctorId) {
      return this.store.clinic.attendingDoctorId.reduce((optionArray, doctorId) => {
        if (doctorMap[doctorId]) {
          optionArray.push(doctorMap[doctorId]);
        }
        return optionArray;
      }, []);
    }
  }

  addPatient() {
    this.router.navigate(['pages/patient/search']);
  }

  patientRegistryExpand() {
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

  getRowClass(row) {
    switch (row.status) {
      case 'INITIAL':
      case 'PRECONSULT':
      case 'CONSULT':
      case 'PAYMENT':
      case 'POST_CONSULT':
        return 'row-active';

      case 'COMPLETE':
        return 'row-inactive';

      default:
        return 'row-active';
    }
  }

  checkPermission(status) {
    // console.log('status: ', status);
    switch (status) {
      case 'INITIAL':
      // case 'PRECONSULT':
      case 'CONSULT':
        return !this.permissionsService.getPermission('ROLE_DOCTOR');

      case 'POST_CONSULT':
      case 'PAYMENT':
        return !this.permissionsService.getPermission('ROLE_CA');

      case 'COMPLETE':
      default:
        return false;
    } // when user has no access, this returns undefined. set to buttonIsDisabled = true
  }

  buttonIsDisabled(status) {
    const hasNoAccess = this.checkPermission(status);
    let buttonStyle = 'btn btn-sm btn-link font-weight-semi-bold pt-0 pl-0 ';

    switch (status) {
      case 'INITIAL': // Initial use for testing : replace value with value to test
        buttonStyle += 'consultation pre';
        break;
      case 'PRECONSULT':
        buttonStyle += 'consultation pre';
        break;
      case 'CONSULT':
        buttonStyle += 'consultation consult';
        break;
      case 'PAYMENT':
        buttonStyle += 'consultation payment';
        break;
      case 'POST_CONSULT':
        buttonStyle += 'consultation post';
        break;
      case 'COMPLETE':
        buttonStyle += 'consultation completed';
        break;

      default:
        buttonStyle += ' row-active';
        break;
    }

    if (hasNoAccess) {
      return buttonStyle + ' disabled';
    } else {
      return buttonStyle;
    }
  }

  /** FILTER */
  multipleFilters(data, filters) {
    const filterKeys = Object.keys(filters);
    // filters all elements passing the criteria
    return data.filter(item => {
      // dynamically validate all filter criteria
      return filterKeys.every(key => {
        if (!filters[key].length || key === 'name') {
          return true;
        }

        return filters[key].includes(item[key]);
      });
    });
  }

  nameFilter(key, data) {
    console.log('​nameFilter -> key', key, data);
    if (key) {
      const filteredData = data.filter(item => {
        return (item.name || '').toLowerCase().includes(key);
      });
      return filteredData;
    }
    return data;
  }

  setFilterValue(event: any, searchKey) {
    console.log('event: ', event);
    console.log('searchKey: ', searchKey);

    switch (searchKey) {
      case 'name':
        const value = event.target.value.toLowerCase();
        return [value];
      case 'doctor':
      case 'status':
        if (!event) {
          return this.statusFilterDropdown;
        }
        return event;
      default:
        return event;
    }
  }

  updateFilter(event: any, searchKey: string) {
    // get filter value
    const val = this.setFilterValue(event, searchKey);

    console.log('​updateFilter -> val', val);

    this.filterOptions[searchKey] = val;

    console.log('​updateFilter -> this.filterOptions', this.filterOptions);

    this.doFilter();
  }

  private doFilter() {
    let filteredData = this.multipleFilters(this.originalRowData, this.filterOptions);
    if (this.filterOptions['name'] && this.filterOptions['name'][0]) {
      filteredData = this.nameFilter(this.filterOptions['name'][0], filteredData);
    }
    // console.log('​updateFilter -> sss', filteredData);
    this.rows = filteredData;
  }
  /** END FILTER */

  redirectToPatientDetail(patientId: string, visitId: string, caseId: string) {
    this.store.setPatientId(patientId);
    this.store.setPatientVisitRegistryId(visitId);
    this.store.setCaseId(caseId);
    this.router.navigate(['/pages/patient/detail']);
    return false;
  }

  populateEntries(event) {
    this.pageLimit = event.value;
  }

  redirectToNextPage(value: string, patientId: string, caseId: string, visitId: string, doctorId: string) {
    this.store.setPatientId(patientId);
    this.store.setPatientVisitRegistryId(visitId);
    this.store.setCaseId(caseId);
    this.store.setVisitStatus(value);

    switch (value) {
      case 'INITIAL':
        // change to pre consult
        this.apiPatientVisitService
          .consult(visitId, this.store.getUser().context['cms-user-id'])
          .pipe(
            distinctUntilChanged(),
            debounceTime(200)
          )
          .subscribe(
            resp => {
              if (resp.statusCode === 'S0000') {
                this.getPatientRegistryList();
              } else {
                alert(resp.message);
              }
            },
            err => {
              this.alertService.error(JSON.stringify(err.error.message));
              alert(err.error.message);
            }
          );
        return null;
      case 'PRECONSULT':
        return null;
      case 'CONSULT':
        this.router.navigate(['/pages/patient/management'], {
          queryParams: { tabIndex: 2, showSidePane: true }
        });
        return null;
      case 'PAYMENT':
        this.paymentService.setConsultationInfo(null);
        this.router.navigate(['/pages/patient/management'], {
          queryParams: { tabIndex: 8, showSidePane: false }
        });
        return null;
      case 'POST_CONSULT':
        this.router.navigate(['/pages/patient/management'], {
          queryParams: { tabIndex: 6, showSidePane: false }
        });
        return null;
      case 'COMPLETE':
        // do nothing
        this.router.navigate(['/pages/patient/detail'], {
          queryParams: { tabIndex: 2 }
        });
        return null;

      default:
        return null;
    }
  }

  btnActionProceed(row) {
    this.logger.info('Proceed Action Pressed', row.patientId, this.selectedAction);
    switch (this.selectedAction) {
      case this.actionList[0]:
        this.showAddVitalSigns(row.patientId);
        break;
      case this.actionList[1]:
        this.showUpdateMedicalCoverage(row);
        break;
      default:
        break;
    }
    this.selectedAction = '';
  }

  showAddVitalSigns(patientId: string) {
    const initialState = {
      isModal: true,
      patientId: patientId,
      currentPatientId: patientId,
      vitalForm: this.consultationFormService.generateVitalForm(),
      title: 'Vital Sign'
    };

    const customClass = { class: 'container' };

    this.bsModalRef = this.modalService.show(VitalAddComponent, { initialState, class: 'modal-xl' });
    this.bsModalRef.content.closeBtnName = 'Close';

    this.modalService.onShow.subscribe(reason => {
      console.log('​VitalContainerComponent -> addVital -> reason', reason);
      this.vitalFormService.resetVitalSignFormArray();
    });
  }

  showUpdateMedicalCoverage(row) {
    console.log('row: ', row);
    this.apiCaseManagerService.searchCase(row.caseId).subscribe(
      res => {
        let attachedMedicalCoverages = [];
        if (res.payload.coverages) {
          attachedMedicalCoverages = res.payload.coverages;
        }

        console.log('ATTACHED MEDICAL COVERAGES: ', attachedMedicalCoverages);
        this.proceedToUpdateMedicalCoverage(row.caseId, row.patientId, row.visitId, attachedMedicalCoverages);
      },
      err => {
        this.alertService.error(JSON.stringify(err));
        this.proceedToUpdateMedicalCoverage(row.caseId, row.patientId, row.visitId, []);
      }
    );
  }

  proceedToUpdateMedicalCoverage(
    caseId: string,
    patientId: string,
    patientRegistryId: string,
    attachedMedicalCoverages: any[]
  ) {
    this.store.setPatientId(patientId);
    const selectedMC = new FormArray([]);

    attachedMedicalCoverages.forEach(mc => {
      console.log('pa li attachedMedicalCoverages: ', mc);

      const mcFG = this.fb.group({ planId: mc.planId });
      // selectedMC.controls.push(this.fb.control('AAA'));
      // const planId = this.fb.control(mc.planId)
      // console.log("mcFG: ",planId);
      selectedMC.push(mcFG);
    });

    // selectedMC.patchValue(plans)

    console.log('pa li plans: ', selectedMC);
    console.log('pa li selectedMC: ', selectedMC);
    const initialState = {
      title: 'Update Medical Coverage',
      type: 'ATTACH_MEDICAL_COVERAGE',
      hiddenTabs: true,
      selectedCoverages: selectedMC
    };

    this.confirmationBsModalRef = this.modalService.show(PatientAddQueueConfirmationComponent, {
      initialState,
      class: 'modal-lg'
    });

    this.confirmationBsModalRef.content.event.subscribe(data => {
      if (data) {
        // Patient Visit Attach Medical Coverage
        this.apiPatientVisitService
          .attachMedicalCoverage(caseId, data.attachedMedicalCoverages.map(coverage => coverage.planId))
          .subscribe(
            res => {
              this.confirmationBsModalRef.content.event.unsubscribe();
              this.confirmationBsModalRef.hide();
              this.store.setPatientId('');
            },
            err => {
              this.alertService.error(JSON.stringify(err));
            }
          );
      } else {
        console.log('No data emitted');
      }
    });
  }

  checkForCookies() {
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
    }
  }

  preventClose(event: MouseEvent) {
    event.stopImmediatePropagation();
  }

  customiseBodyBackgroundColor() {
    document.body.style.backgroundColor = '#f2f2f2';
  }

  destroyBodyBackgroundColor() {
    document.body.style.backgroundColor = '#ffffff';
  }
}
