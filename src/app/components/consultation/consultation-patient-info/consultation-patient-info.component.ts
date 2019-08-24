import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { MedicalCoverageResponse } from './../../../objects/response/MedicalCoverageResponse';
import { MedicalCoverageComponent } from './../../../views/components/medical-coverage/medical-coverage/medical-coverage.component';
import { ApiCmsManagementService } from './../../../services/api-cms-management.service';
import { ApiPatientVisitService } from './../../../services/api-patient-visit.service';
import { UtilsService } from './../../../services/utils.service';
import { AlertService } from './../../../services/alert.service';
import { Allergy } from './../../../objects/response/Allergy';
import { MedicalAlert } from './../../../objects/response/MedicalAlert';
import { MedicalAlertResponse } from './../../../objects/response/MedicalAlertResponse';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiPatientInfoService } from './../../../services/api-patient-info.service';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { StoreService } from '../../../services/store.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { UserRegistrationObject } from '../../../objects/UserRegistrationObject';
import { DISPLAY_DATE_FORMAT } from '../../../constants/app.constants';
import { ApiCaseManagerService } from '../../../services/api-case-manager.service';

@Component({
  selector: 'app-consultation-patient-info',
  templateUrl: './consultation-patient-info.component.html',
  styleUrls: ['./consultation-patient-info.component.scss']
})
export class ConsultationPatientInfoComponent implements OnInit {
  @Input() hideAlerts = false;
  @Input() patientNameRedirect = false;
  @Input() patientChange = false;
  // selectedItems: SelectedItem[];
  bsModalRef: BsModalRef;
  alerts: Array<Allergy>;
  medicalAlerts: Array<MedicalAlertResponse>;
  patientInfo: UserRegistrationObject;
  coverages;

  patientId: string;
  patientNo: string;
  patientName: string;
  age: string;
  sex: string;
  dob: string;
  nric: string;
  occupation: string;
  address: string;
  address1: string;
  address2: string;
  postal: string;
  maritalStatus: string;
  contactNo: string;
  priorityMedicalCoverage: string;
  attachedMedicalCoverages: FormArray;

  private componentDestroyed: Subject<void> = new Subject();

  constructor(
    private apiPatientInfoService: ApiPatientInfoService,
    private apiPatientVisitService: ApiPatientVisitService,
    private apiCmsManagementService: ApiCmsManagementService,
    private apiCaseManagerService: ApiCaseManagerService,
    private storeService: StoreService,
    private router: Router,
    private alertService: AlertService,
    private utilService: UtilsService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
  
    this.attachedMedicalCoverages = this.fb.array([]);
    this.initPatientInfo('', '', null, '', '', '', '', '', '', '', '', '', '');
    this.initPatientDetails();

    this.storeService.currentPatientId.pipe(takeUntil(this.componentDestroyed)).subscribe(id => {
      this.initPatientInfo('', '', null, '', '', '', '', '', '', '', '', '', '');

      this.patientId = id;
      this.initPatientDetails();
    });
  }

  ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.unsubscribe();
  }

  initPatientDetails() {
    this.initPage();
    this.initPriorityMedicalCoverage();
  }

  initPage() {
    const patientId = this.storeService.getPatientId();

    this.apiPatientInfoService.searchBy('systemuserid', patientId).subscribe(
      res => {
        this.patientInfo = res.payload;
        const { address } = this.patientInfo;

        const separatedAddress = (address.address || '').split('\n');

        const { company } = this.patientInfo;
        let occupation = '';
        if (company) {
          occupation = company.occupation;
        }

        console.log('this.patientInfo: ', this.patientInfo);

        let age = moment().diff(moment(this.patientInfo.dob, DISPLAY_DATE_FORMAT), 'years');
        let ageQuantifier = ' years';
        console.log('PATIENT AGE', age);
        if (age < 1) {
          age = moment().diff(moment(this.patientInfo.dob, DISPLAY_DATE_FORMAT), 'months');
          ageQuantifier = ' months';
        }
        if (age < 1) {
          age = moment().diff(moment(this.patientInfo.dob, DISPLAY_DATE_FORMAT), 'days');
          ageQuantifier = ' days';
        }
        console.log('PATIENT AGE', age);

        this.initPatientInfo(
          this.patientInfo.patientNumber ? this.patientInfo.patientNumber : '-',
          this.patientInfo.name,
          '' + age + ageQuantifier,
          this.patientInfo.gender,
          this.patientInfo.dob,
          this.patientInfo.userId.number,
          occupation,
          `${address.address}, ${address.postalCode}`,
          separatedAddress[0] ? separatedAddress[0] : '',
          // separatedAddress[1] || separatedAddress[1] !== undefined ? separatedAddress[1] : '',
          separatedAddress[1] ? separatedAddress[1] : '',
          `${address.postalCode}`,
          this.patientInfo.maritalStatus,
          `${
            this.patientInfo.contactNumber.number // `${this.patientInfo.contactNumber.countryCode}-${this.patientInfo.contactNumber.number}`
          }`
        );
        this.alerts = this.patientInfo.allergies;
        console.log('ALLERGY ALERTS: ', this.alerts);
      },
      err => {
        this.alertService.error(JSON.stringify(err.error.message));
      }
    );

    this.medicalAlerts = Array<MedicalAlertResponse>();
    this.apiPatientInfoService.listAlert(patientId).subscribe(
      res => {
        if (res.payload) {
          const alertDetails = <Array<MedicalAlertResponse>>res.payload.details;
          const tempAlertArray = Array<MedicalAlertResponse>();
          alertDetails.forEach(alert => {
            if (alert.alertType !== 'ALLERGY') {
              tempAlertArray.push(alert);
            }
          });
          this.medicalAlerts = tempAlertArray;
          console.log('MEDICAL ALERTS: ', this.medicalAlerts);
        }
      },
      err => {
        this.alertService.error(JSON.stringify(err.error.message));
      }
    );
  }

  initPatientInfo(
    patientNo: string,
    patientName: string,
    age: string,
    sex: string,
    dob: string,
    nric: string,
    occupation: string,
    address: string,
    address1: string,
    address2: string,
    postal: string,
    maritalStatus: string,
    contactNo: string
  ) {
    this.patientNo = patientNo;
    this.patientName = patientName;
    this.age = age;
    this.sex = sex;
    this.dob = dob;
    this.nric = nric;
    this.occupation = occupation;
    this.address = this.utilService.convertToTitleCaseUsingSpace(address);
    this.address1 = this.utilService.convertToTitleCaseUsingSpace(address1);
    this.address2 = address2 === undefined ? '' : this.utilService.convertToTitleCaseUsingSpace(address2);
    this.postal = this.utilService.convertToTitleCaseUsingSpace(postal);
    this.maritalStatus = maritalStatus;
    this.contactNo = contactNo;
  }

  openPatientDetail() {
    window.open(`/pages/patient/detail/${this.patientInfo.id}`);
    // this.router.navigate([`/pages/patient/detail/${this.patientInfo.id}`]);
  }

  getPatientDetailRoute() {
    if (this.patientInfo && this.patientInfo.id) {
      return `/pages/patient/detail/${this.patientInfo.id}`;
    } else {
      return '';
    }
  }

  initPriorityMedicalCoverage() {
    if (this.storeService.getCaseId()) {
      this.apiCaseManagerService.searchCase(this.storeService.getCaseId()).subscribe(
        res => {
          this.priorityMedicalCoverage = '';
          this.attachedMedicalCoverages.controls = [];
          res.payload.coverages.forEach((selectedPlan, index) => {
            const selectedPlanId = selectedPlan.planId;
            const coverage = this.storeService.getMedicalCoverages().find(coverage => coverage.coveragePlans.some(plans => plans.id === selectedPlanId));
            if (coverage){
              this.attachedMedicalCoverages.push(this.fb.group({
                medicalCoverageId: coverage.id,
                planId: selectedPlanId
              }));
  
              if (index === 0){
                this.priorityMedicalCoverage = coverage.name || '';
              }
            }
          })
        },
        err => {
          this.alertService.error(JSON.stringify(err));
        }
      );
    }
  }

  showMedicalCoverages() {
        this.displayMedicalCoveragesModal(
          this.storeService.getPatientId(),
          this.storeService.getPatientVisitRegistryId(),
          this.attachedMedicalCoverages
        );
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes: ', changes);
  }

  displayMedicalCoveragesModal(patientId: string, patientRegistryId: string, selectedCoverages: FormArray) {
    console.log('con-pa selectedCoverages: ', selectedCoverages);
    this.storeService.setPatientId(patientId);
    const initialState = {
      title: 'Assigned Medical Coverages',
      type: 'DISPLAY_MEDICAL_COVERAGE',
      selectedCoverages: selectedCoverages,
      patientCoverages: new FormControl(),
      displaySelectedCoverages: true
    };

    this.bsModalRef = this.modalService.show(MedicalCoverageComponent, {
      initialState,
      class: 'modal-lg'
    });

    this.bsModalRef.content.event.subscribe(data => {
      if (data) {
        if (data !== 'Close') {
          // Patient Visit Attach Medical Coverage
          this.apiPatientVisitService.attachMedicalCoverage(this.storeService.getCaseId(), data.attachedMedicalCoverages).subscribe(
            res => {
              this.bsModalRef.content.event.unsubscribe();
              this.bsModalRef.hide();
              this.storeService.setPatientId('');
            },
            err => {
              this.alertService.error(JSON.stringify(err));
            }
          );
        } else {
          this.bsModalRef.hide();
        }
      } else {
        console.log('No data emitted');
      }
    });
  }
}
