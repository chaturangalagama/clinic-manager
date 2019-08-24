import { MedicalCertificateItemsArrayComponent } from './../../../../../components/consultation/consultation-medical-certificate/medical-certificate-items-array.component';
import { NgxPermissionsService } from 'ngx-permissions';

// General Libraries
import { Subject } from 'rxjs';
import { TabsetComponent, TabDirective } from 'ngx-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Component, OnInit, EventEmitter, Output, ViewChild, Input, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
// Services
import { StoreService } from '../../../../../services/store.service';
import { ConsultationFormService } from './../../../../../services/consultation-form.service';

// Objects
import { MedicalCoverageResponse } from './../../../../../objects/response/MedicalCoverageResponse';
import { DispatchDrugDetail } from './../../../../../objects/request/DrugDispatch';
import { PatientVisitHistory } from '../../../../../objects/request/PatientVisitHistory';

// Constants
import { VISIT_MANAGEMENT_TABS, DISPLAY_DATE_FORMAT, INPUT_DELAY } from './../../../../../constants/app.constants';
import { ApiPatientVisitService } from '../../../../../services/api-patient-visit.service';
import { CaseChargeFormService } from '../../../../../services/case-charge-form.service';
import { ApiCmsManagementService } from '../../../../../services/api-cms-management.service';
import { AlertService } from '../../../../../services/alert.service';

@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.component.html',
  styleUrls: ['./consultation.component.scss']
})
export class ConsultationComponent implements OnInit, AfterViewInit {
  // Component General Controls
  allowEdit = new Subject<boolean>();

  // Tab Variable and Control Options
  @Input() selectedTabIndex;
  @Input() visitManagementFormGroup: FormGroup;
  @Input() needRefresh: Subject<boolean>;
  @Input() showSidePane;
  @ViewChild('consultationTabs') consultationTabs: TabsetComponent;

  // Output Variable to emit index of tab selected
  @Output() tabSelected = new EventEmitter<String>();

  // To store index of tab selected in this component
  selectedTab;

  // Global Info
  consultationInfo;
  visitStatus;
  subscriptions = [];
  @Input() patientInfo;
  @Output() onSave = new EventEmitter<number>();

  // Profile Tab
  editMode = false;

  // Vital Signs Tab
  vitalForm: FormGroup;

  // Consultation Tab
  consultationForm: FormGroup;
  recentVisit: PatientVisitHistory;

  @Output() copiedPrescription = new EventEmitter<DispatchDrugDetail[]>();

  // Medical Coverage Tab
  @Input() selectedPlans: FormArray;
  @Input() attachedMedicalCoverages: FormArray;
  @Input() policyHolderInfo: FormArray;
  coverages: MedicalCoverageResponse;

  // Medical Services Tab
  referralShown = false;
  memoShown = false;
  medicalCertificateShown = false;
  followUpShown = false;

  // Documents Tab
  @Input() documentsFormGroup: FormGroup;

  private componentDestroyed: Subject<void> = new Subject();

  constructor(
    private fb: FormBuilder,
    private consultationFormService: ConsultationFormService,
    private store: StoreService,
    private permissionsService: NgxPermissionsService,
    private apiPatientVisitService: ApiPatientVisitService,
    private apiCmsManagementService: ApiCmsManagementService,
    private caseChargeFormService: CaseChargeFormService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.visitStatus = this.store.getVisitStatus();

    this.createForms();

    this.getConsultationInfo();

    this.store
      .getPatientVisitIdRefresh()
      .pipe(
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.componentDestroyed)
      )
      .subscribe(value => {
        if (value) {
          this.getConsultationInfo();
          this.configureInitialTabByRole();
        }
      });

    this.needRefresh.subscribe(res => {
      console.log('needRefresh :');
      this.configureInitialTabByRole();
    });
  }

  ngAfterViewInit() {
    this.consultationTabs.tabs[this.selectedTabIndex].active = true;
    this.selectedTab = this.getSelectedTab(this.selectedTabIndex);
    this.configureTabVisibility();
  }

  ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.unsubscribe();
  }

  getConsultationInfo() {
    console.log('getConsultationInfo');
    this.apiPatientVisitService.patientVisitSearch(this.store.getPatientVisitRegistryId()).subscribe(
      res => {
        this.consultationInfo = res.payload;
        this.patchValueToConsultationFormGroup(this.consultationInfo);
      },
      err => {
        console.log('err', err);
      }
    );
  }

  patchValueToConsultationFormGroup(consultation) {
    const refEntity = consultation.medicalReferenceEntity;
    console.log('patchValueToConsultationFormGroup: ', consultation);

    const consultationFormGroup = this.visitManagementFormGroup.get('consultationFormGroup').get('consultation');
    this.consultationFormService.patchConsultationToFormGroup(refEntity, consultationFormGroup);

    const dispatchItemFormArray = this.visitManagementFormGroup
      .get('consultationFormGroup')
      .get('dispatchItemEntities') as FormArray;
    this.consultationFormService.patchDispatchItemsToFormArray(
      consultation.medicalReferenceEntity,
      dispatchItemFormArray
    );

    const diagnosisArray = this.visitManagementFormGroup.get('consultationFormGroup').get('diagnosisIds') as FormArray;
    this.consultationFormService.patchDiagnosisToFormArray(refEntity, diagnosisArray);

    const referralArray: FormArray = this.visitManagementFormGroup
      .get('consultationFormGroup')
      .get('patientReferral')
      .get('patientReferrals') as FormArray;
    this.consultationFormService.patchReferralToFormArray(consultation.medicalReferenceEntity, referralArray);

    this.consultationFormService.patchFollowUpToFormGroup(
      refEntity,
      this.visitManagementFormGroup.get('consultationFormGroup').get('consultationFollowup')
    );
    const medicalCertificates = this.visitManagementFormGroup
      .get('consultationFormGroup')
      .get('medicalCertificates') as FormArray;
    MedicalCertificateItemsArrayComponent.patchMedicalCertificateToFormArray(
      consultation.medicalReferenceEntity,
      medicalCertificates
    );
  }

  configureInitialTabByRole() {
    // Listen for Tab Changes
    // and switch tab content to current tab selected
    console.log('configureInitialTabByRole');
    if (this.consultationTabs.tabs[this.selectedTabIndex]) {
      this.visitStatus = this.store.getVisitStatus();
      const status = this.visitStatus;
      console.log('#003 ADMIN ROLE STATUS: ', status);

      if (this.permissionsService.getPermission('ROLE_DOCTOR') && !this.permissionsService.getPermission('ROLE_CA')) {
        // Doctor Role
        if (status === 'INITIAL' || status === 'POST_CONSULT' || status === 'PAYMENT') {
          this.selectedTabIndex = 0;
        } else if (status === 'CONSULT') {
          this.selectedTabIndex = 2;
        }
      } else if (
        !this.permissionsService.getPermission('ROLE_DOCTOR') &&
        this.permissionsService.getPermission('ROLE_CA')
      ) {
        // CA role
        if (status === 'INITIAL' || status === 'CONSULT') {
          this.selectedTabIndex = 0;
        } else if (status === 'POST_CONSULT') {
          this.selectedTabIndex = 6;
        } else if (status === 'PAYMENT') {
          this.selectedTabIndex = 8;
        }
      } else {
        console.log('#002 ADMIN ROLE STATUS: ', status);
        if (status === 'INITIAL') {
          this.selectedTabIndex = 0;
        } else if (status === 'CONSULT') {
          this.selectedTabIndex = 2;
        } else if (status === 'POST_CONSULT') {
          this.selectedTabIndex = 6;
        } else if (status === 'PAYMENT') {
          this.selectedTabIndex = 8;
        }
      }

      this.consultationTabs.tabs[this.selectedTabIndex].active = true;
      this.selectedTab = this.getSelectedTab(this.selectedTabIndex);
      this.configureTabVisibility();
    }
  }

  configureTabVisibility() {
    // CA Role
    console.log('configureTabVisibility');
    if (!this.permissionsService.getPermission('ROLE_DOCTOR')) {
      this.consultationTabs.tabs[2].disabled = true;
      this.displayTab(5);
      this.displayTab(6);
      this.displayTab(7);
    } else if (!this.permissionsService.getPermission('ROLE_CA')) {
      // Doctor Role
      this.consultationTabs.tabs[2].disabled = false;
      this.hideTab(5);
      this.hideTab(6);
      this.hideTab(7);
    }
  }

  copyPrescription(event) {
    const dispatchItemFormArray = this.visitManagementFormGroup
      .get('consultationFormGroup')
      .get('dispatchItemEntities') as FormArray;
    this.consultationFormService.patchDispatchItemsToFormArray(event, dispatchItemFormArray);
  }

  hideTab(index) {
    console.log('hideTab');
    this.consultationTabs.tabs[index].customClass = 'hiddenTab';
  }

  displayTab(index) {
    console.log('displayTab');
    this.consultationTabs.tabs[index].customClass = '';
  }

  // Get Index of Tab Selected
  getSelectedTab(index) {
    this.selectedTabIndex = index;
    let tempInt = parseInt(index);
    return VISIT_MANAGEMENT_TABS[tempInt];
  }

  // Get Name of Tab Selected
  getSelectedTabIndex(title) {
    return VISIT_MANAGEMENT_TABS.findIndex(tab => {
      console.log('tab: ', tab, title);
      return tab === title;
    });
  }

  // Initalise consultation Forms
  createForms() {
    this.vitalForm = this.consultationFormService.generateVitalForm();
  }

  // On Tab Select
  onSelect($event) {
    if ($event instanceof TabDirective) {
      this.selectedTab = $event.heading;

      if ($event.heading && $event.heading !== undefined) {
        // this.selectedTabIndex = this.getSelectedTabIndex($event.heading);
        this.tabSelected.emit($event.heading);
        return;
      }
    }
  }

  toggleTabTo(event) {
    this.selectedTab = event;
    this.selectedTabIndex = this.getSelectedTabIndex(event);
    this.consultationTabs.tabs[this.selectedTabIndex].active = true;
    this.tabSelected.emit(event);
  }

  // On Patient Edit Button Clicked
  onEnableEdit() {
    this.allowEdit.next(true);
    this.visitManagementFormGroup.get('profileFormGroup').enable();
  }

  onBtnSaveDetailsClicked() {
    this.allowEdit.next(false);
    this.visitManagementFormGroup.get('profileFormGroup').disable();
  }

  onBtnConsultClicked() {
    console.log('Consult Button Clicked');
  }

  getVitalForm() {
    return this.vitalForm;
  }

  isVisitInPostConsult() {
    // console.log("visit in postconsult");
    return this.store.getVisitStatus() === 'POST_CONSULT' && this.permissionsService.getPermission('ROLE_CA');
  }

  isVisitInPayment() {
    return this.store.getVisitStatus() === 'PAYMENT' && this.permissionsService.getPermission('ROLE_CA');
  }

  isRollbacked(event) {
    console.log('event', event);
    this.store.setVisitStatus('POST_CONSULT');
    this.toggleTabTo('Dispensing');
  }
}
