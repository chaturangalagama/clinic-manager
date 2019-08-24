import { map, mergeMap } from 'rxjs/operators';
import { LoggerService } from './../../../../services/logger.service';
import { AlertService } from './../../../../services/alert.service';
import { DialogService } from './../../../../services/dialog.service';
import { Observable, timer } from 'rxjs';
import { ConsultationHistoryComponent } from './../../../../components/consultation/consultation-history/consultation-history.component';
import { VitalTrendComponent } from './../../../../components/consultation/vital/vital-trend/vital-trend.component';
import { ConsultationPatientInfoComponent } from './../../../../components/consultation/consultation-patient-info/consultation-patient-info.component';
import { DISPLAY_DATE_FORMAT } from './../../../../constants/app.constants';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StoreService } from './../../../../services/store.service';
import { DispatchDrugDetail } from './../../../../objects/request/DrugDispatch';
import { UtilsService } from './../../../../services/utils.service';
import { Consultation } from './../../../../objects/request/Consultation';
import { ApiPatientVisitService } from './../../../../services/api-patient-visit.service';
import { ConsultationFormService } from './../../../../services/consultation-form.service';
import { MedicalCertificateItemsArrayComponent } from './../../../../components/consultation/consultation-medical-certificate/medical-certificate-items-array.component';
import { Component, OnInit, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import * as moment from 'moment';
import { TempStoreService } from '../../../../services/temp-store.service';

@Component({
  selector: 'app-consultation-add',
  templateUrl: './consultation-add.component.html',
  styleUrls: ['./consultation-add.component.scss']
})
export class ConsultationAddComponent implements OnInit, OnDestroy {
  @ViewChild(ConsultationPatientInfoComponent) private consultationPatientInfo: ConsultationPatientInfoComponent;
  @ViewChild(VitalTrendComponent) private vitalTrend: VitalTrendComponent;
  @ViewChild(ConsultationHistoryComponent) private consultationHistoryComponent: ConsultationHistoryComponent;

  isConsultationHidden = false;

  consultationForm: FormGroup;
  vitalForm: FormGroup;
  consultation: Consultation;

  immunizationShown: boolean;
  medicalCertificateShown: boolean;
  laboratoryShown: boolean;
  referralShown: boolean;
  memoShown: boolean;
  followUpShown: boolean;

  navigationSubscription;

  tempStorage: any;

  isSaving = false;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event);

    if (event.keyCode === 113) {
      console.log('F2');
    }

    if (event.keyCode === 115) {
      console.log('F4');
      this.onSubmit();
    }
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private consultationFormService: ConsultationFormService,
    private apiPatientVisitService: ApiPatientVisitService,
    private tempStore: TempStoreService,
    private util: UtilsService,
    private store: StoreService,
    private dialogService: DialogService,
    private alertService: AlertService,
    private logger: LoggerService
  ) {
    this.activatedRoute.params.subscribe((params: Params) => {
      console.log('----roure----', params);
    });

    this.showAllSections();
  }

  ngOnInit() {
    if (!this.store.getPatientId()) {
      this.router.navigate(['pages/patient/list']);
    }

    this.createForm();

    // Check whether there is previously stored consultation notes
    this.tempStore.tempStoreRetrieve(this.store.getPatientVisitRegistryId()).subscribe(
      res => {
        if (res.payload && res.payload['value'])
          this.consultationForm.get('consultationNotes').patchValue(JSON.parse(res.payload['value']));
      },
      err => {
        this.alertService.error(err);
      }
    );

    // Register 30s save for the consultation note
    const source = timer(30000, 30000);
    this.tempStorage = source.subscribe(val => {
      this.saveConsultationNote();
    });
  }

  private saveConsultationNote() {
    const consultationNote = this.consultationForm.get('consultationNotes').value;
    this.logger.info('Update Temp Storage', consultationNote);
    // if (consultationNote) {
    this.tempStore.tempStore(this.store.getPatientVisitRegistryId(), JSON.stringify(consultationNote)).subscribe(
      res => {
        // if (res.payload && res.payload['value'])
        //   this.consultationForm.get('consultationNotes').patchValue(res.payload['value']);
      },
      err => {
        this.alertService.error(err);
      }
    );
    // }
  }

  showAllSections() {
    this.immunizationShown = true;
    this.medicalCertificateShown = true;
    this.laboratoryShown = true;
    this.referralShown = true;
    this.memoShown = true;
    this.followUpShown = true;
  }

  ngOnDestroy() {
    this.consultationFormService.resetForm();
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }

    this.tempStorage.unsubscribe();
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.isSaving && this.consultationForm.dirty) {
      this.saveConsultationNote();
      return this.dialogService.confirm('Your changes have not been saved. \n\nAre you sure want to leave this page?');
    }
    return true;
  }

  /**
   *
   *
   * @memberof ConsultationAddComponent
   */
  createForm() {
    // this.consultationFormService.resetForm();
    this.vitalForm = this.consultationFormService.generateVitalForm();

    this.consultationForm = this.fb.group({
      consultationNotes: ['', Validators.required],
      memo: '',
      medicalCertificates: MedicalCertificateItemsArrayComponent.buildItems(),
      patientReferral: this.fb.group({ patientReferrals: this.consultationFormService.initPatientReferral() }),
      consultationStartTime: this.util.getDBDate(''),
      consultationEndTime: '',
      diagnosisIds: this.consultationFormService.initDiagnosis(),
      followupConsultation: this.consultationFormService.initFollowup(),
      clinicNotes: ''
    });

    console.log('Consultation Form', this.consultationForm);
  }

  getVitalForm() {
    return this.vitalForm;
  }

  btnConsultationHistory() {
    document.querySelector('#consultation-history-div').classList.toggle('collapsed');

    // To make Consultation History smaller or to follow consultation history div's width
    const consultationHistoryButton = document.querySelector('#consultation-history-btn');
    if (consultationHistoryButton.classList.contains('col-md-6')) {
      consultationHistoryButton.classList.remove('col-md-6');
      consultationHistoryButton.classList.add('col-md-2');
      this.isConsultationHidden = true;
    } else {
      consultationHistoryButton.classList.add('col-md-6');
      consultationHistoryButton.classList.remove('col-md-2');
      this.isConsultationHidden = false;
    }
  }

  copyPrescription(data: DispatchDrugDetail[]) {
    // this.consultationFormService.addNewDrugDispatchDetail(data);
  }

  onSubmit() {
    if (this.consultationForm.valid) {
      console.log('SUBMIT');

      // console.log(this.consultationForm.value);
      this.consultation = { ...this.consultationForm.value };
      delete this.consultation['vitalSigns'];
      // delete this.consultation['memo'];
      // delete this.consultation['patientReferral'];

      // TODO: Add doctor id
      // this.consultation['doctorId'] = '5a8e2b81dbea1b53d1c616ee';
      this.consultation['doctorId'] = this.store.getUser().context['cms-user-id'];

      // need to check empty item, like no id and pass empty array instead
      // drugDispatch - drugId
      this.checkDrugDispatch();
      // immunisation - vaccinationId & doseId
      this.checkImmunisation();
      // issuedMedicalTest - testId
      this.checkissuedMedicalTest();
      // medicalCertificates - propose
      this.checkMedicalCertificates();
      // medicalServiceGiven - serviceId & serviceItemId
      this.checkMedicalServiceGiven();
      // patientReferral - clinicId
      this.checkPatientReferral();
      // check Follow Up
      this.checkFollowUp();

      // populate diagnosis ids
      this.populateDiagnosis();

      // populate end time
      this.consultation.consultationEndTime = this.util.getDBDate('');
      console.log('cons', this.consultation);

      // add clinicId
      this.consultation['clinicId'] = this.store.getClinicId();

      // this.consultation['diagnosisIds'] = [];
      const createConsult$ = this.apiPatientVisitService.consultationCreate(
        this.store.getPatientId(),
        this.consultation
      );

      createConsult$
        .pipe(
          map(res => res),
          mergeMap(consultation =>
            this.apiPatientVisitService.postConsult(this.store.getPatientVisitRegistryId(), consultation.payload.id)
          )
        )
        .subscribe(
          resp => {
            alert('Consultation Saved Successfully.');
            this.isSaving = true;
            this.router.navigate(['pages/patient/list']);
          },
          err => {
            this.alertService.error(JSON.stringify(err.error.message));
            // console.log(err);
            this.isSaving = false;
          }
        );
    } else {
      console.log('Invalid Form');
    }
  }

  checkDrugDispatch() {
    const drugDispatch = this.consultation.drugDispatch;

    const newDrugDispatch = drugDispatch.dispatchDrugDetail.filter(
      value => null !== value.drugId && value.drugId !== '0' && value.drugId.length > 0
    );
    this.consultation.drugDispatch.dispatchDrugDetail = newDrugDispatch;
  }

  checkImmunisation() {
    const immunisation = this.consultation.immunisationGiven.immunisation;

    const newImmunisation = immunisation.filter(
      value => null !== value.doseId && value.doseId !== '0' && value.doseId.length > 0
    );

    newImmunisation.forEach(value => {
      console.log('Next Dose Date', value.nextDose);
      value.nextDose = value.nextDose && moment(value.nextDose, DISPLAY_DATE_FORMAT).format(DISPLAY_DATE_FORMAT);
      console.log('Value NextDose', value.nextDose);
    });

    console.log('New Immu', newImmunisation);

    this.consultation.immunisationGiven.immunisation = newImmunisation;
  }

  checkissuedMedicalTest() {
    const issuedMedicalTest = this.consultation.issuedMedicalTest;

    const newIssuedMedicalTest = issuedMedicalTest.issuedMedicalTestDetails.filter(
      value => null !== value.testId && value.testId !== '0' && value.testId.length > 0
    );
    this.consultation.issuedMedicalTest.issuedMedicalTestDetails = newIssuedMedicalTest;
  }

  checkMedicalCertificates() {
    const medicalCertificates = this.consultation.medicalCertificates;
    console.log('medical certificates: ', medicalCertificates);
    const newMedicalCertificates = medicalCertificates.filter(
      value => null !== value.purpose && value.purpose !== '0' && value.purpose.length > 0
    );

    newMedicalCertificates.forEach(value => {
      if (value.otherReason) {
        value.purpose = value.otherReason;
        delete value.otherReason;
      }
      value.startDate = value.startDate && moment(value.startDate, DISPLAY_DATE_FORMAT).format(DISPLAY_DATE_FORMAT);

      if (value.halfDayOption === '') {
        console.log('value halfdayOption: ', value.halfDayOption);
        delete value.halfDayOption;
      }
      console.log('Value MC StartDate', value.startDate);
    });

    this.consultation.medicalCertificates = newMedicalCertificates;
  }

  checkMedicalServiceGiven() {
    const medicalServiceGiven = this.consultation.medicalServiceGiven.medicalServices;

    const newMedicalServiceGiven = medicalServiceGiven.filter(
      value =>
        null !== value.serviceId &&
        value.serviceId !== '0' &&
        value.serviceId.length > 0 &&
        value.serviceItemId !== '0' &&
        value.serviceItemId.length > 0
    );
    this.consultation.medicalServiceGiven.medicalServices = newMedicalServiceGiven;
  }

  checkPatientReferral() {
    // const currentPatientReferral = (<FormArray>this.consultationForm.get('patientReferral')).controls[0].value;
    const currentPatientReferrals = this.consultation.patientReferral.patientReferrals;

    const newCurrentPatientReferrals = currentPatientReferrals.filter(
      value =>
        (value.practice &&
          value.practice !== '' &&
          value.clinicId &&
          value.clinicId !== '' &&
          value.doctorId &&
          value.doctorId !== '' &&
          value.appointmentDateTime !== '') ||
        (value.practice &&
          value.externalReferralDetails &&
          value.practice !== '' &&
          value.externalReferralDetails.doctorName &&
          value.externalReferralDetails.doctorName !== '' &&
          value.externalReferralDetails.address &&
          value.externalReferralDetails.address !== '') ||
        value.externalReferral
    );

    this.consultation.patientReferral.patientReferrals = newCurrentPatientReferrals;
    console.log('new current patient referral: ', newCurrentPatientReferrals);
  }

  checkFollowUp() {
    const currentPatientFollowUp = (<FormArray>this.consultationForm.get('followupConsultation')).value;
    if (
      currentPatientFollowUp['followupDate'] === '' ||
      !currentPatientFollowUp['followupDate'] ||
      (currentPatientFollowUp['remarks'] === '' || !currentPatientFollowUp['remarks'])
    ) {
      delete this.consultation.followupConsultation;
    } else {
      this.consultation.followupConsultation.followupDate =
        this.consultation.followupConsultation.followupDate &&
        moment(this.consultation.followupConsultation.followupDate, DISPLAY_DATE_FORMAT).format(DISPLAY_DATE_FORMAT);
      // this.consultation.followupConsultation = currentPatientFollowUp;
    }
  }

  populateDiagnosis() {
    const diagnosis = this.consultation.diagnosisIds;
    // const newDiagnosisIds = { ...this.consultation.diagnosisIds };
    const newDiagnosisIds = [];
    console.log('NEW DIAGNOSIS ID', diagnosis);

    if (null != diagnosis) {
      console.log('diagx', diagnosis);

      diagnosis.map((value, index) => {
        if (value.id) {
          newDiagnosisIds.push(value.id);
        }
      });
      console.log('diagx1', newDiagnosisIds);
      this.consultation.diagnosisIds = newDiagnosisIds;
    } else {
      this.consultation.diagnosisIds = [];
    }
  }

  patientInfoExpand() {
    // console.log('body.classList: ', document.querySelector('body').classList);
    const bodyClassList = document.querySelector('body').classList;

    if (
      bodyClassList.contains('sidebar-hidden') ||
      bodyClassList.contains('asidemenu-hidden') ||
      bodyClassList.contains('sidebar-minimized') ||
      bodyClassList.contains('brand-minimized')
    ) {
      return 'col-md-6';
    } else {
      return 'col-md-5';
    }
  }
}
