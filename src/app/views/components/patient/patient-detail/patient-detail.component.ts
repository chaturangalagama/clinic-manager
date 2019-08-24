// General Libraries
import { forkJoin, Subject } from 'rxjs';
import { Location } from '@angular/common';
import { distinctUntilChanged, debounceTime, takeUntil } from 'rxjs/operators';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TabsetComponent } from 'ngx-bootstrap';

// Objects
import { SelectedPlan } from './../../../../objects/MedicalCoverage';
import { Clinic as ClinicOnly } from './../../../../objects/response/Clinic';
import { MedicalAlertResponse } from './../../../../objects/response/MedicalAlertResponse';
import { PatientVisit, PatientVisitRegistryEntity } from '../../../../objects/request/PatientVisit';
import { MedicalCoverageResponse } from '../../../../objects/response/MedicalCoverageResponse';
import { MedicalCoverageSelected, CoverageSelected } from '../../../../objects/MedicalCoverage';

// Services
import { MedicalCoverageFormService } from './../../../../services/medical-coverage-form.service';
import { StoreService } from '../../../../services/store.service';
import { AlertService } from '../../../../services/alert.service';
import { UtilsService } from './../../../../services/utils.service';
import { ApiCmsManagementService } from '../../../../services/api-cms-management.service';
import { ApiPatientInfoService } from '../../../../services/api-patient-info.service';
import { ApiPatientVisitService } from '../../../../services/api-patient-visit.service';
import { PatientService } from '../../../../services/patient.service';

// Components
import { PatientAddQueueConfirmationComponent } from './../../../../components/patient-add/patient-add-queue-confirmation/patient-add-queue-confirmation.component';

// Constants
import {
  DISPLAY_DATE_FORMAT,
  DB_FULL_DATE_FORMAT,
  ALLERGY_TYPES,
  ALERT_PRIORITY,
  ALERT_TYPES,
  ALLERGIES,
  PATIENT_INFO_KEYS
} from '../../../../constants/app.constants';
import { Page } from '../../../../model/page';
import { PrintTemplateService } from '../../../../services/print-template.service';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss']
})
export class PatientDetailComponent implements OnInit {
  @ViewChild('tabs') tabs: TabsetComponent;
  needRefresh: Subject<void> = new Subject<void>();
  private componentDestroyed: Subject<void> = new Subject();

  // UI
  isHistoryListInit = false;
  isInHistoryListTab = false;
  shouldShowPrintLabelBtn = true;
  historyPage: Page = new Page();
  hotKeySaveOnHistoryDetailTab = true;
  confirmationBsModalRef: BsModalRef;

  patientInfo;
  histories;
  patientDocuments;
  visitDocuments;
  storedPatientID;
  storedPatientIDType;

  // Entire Patient Information Carrier
  patientDetailFormGroup: FormGroup;

  // Medical Coverage Information
  policyHolderInfo: FormArray;
  coverages: MedicalCoverageResponse;
  selectedMedicalCoverage: any;
  selectedCoverageType = new Set();

  allergyTypes: any;
  allergyNames: any;

  medicalAlertTypes: any;
  medicalAlertPriorities: any;

  // Medical Alerts
  medicalAlerts: MedicalAlertResponse[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private store: StoreService,
    private alertService: AlertService,
    private modalService: BsModalService,
    private apiCmsManagementService: ApiCmsManagementService,
    private apiPatientInfoService: ApiPatientInfoService,
    private apiPatientVisitService: ApiPatientVisitService,
    private patientService: PatientService,
    private utilsService: UtilsService,
    private fb: FormBuilder,
    private medicalCoverageFormService: MedicalCoverageFormService,
    private printTemplateService: PrintTemplateService
  ) {
    this.historyPage.size = 10;
  }

  ngOnInit() {
    this.activatedRoute.params.pipe(takeUntil(this.componentDestroyed)).subscribe(params => {
      if (params['id']) {
        this.store.setPatientId(params['id']);
        this.location.go('/pages/patient/detail');
      }
    });

    this.activatedRoute.queryParams
      .pipe(
        debounceTime(50),
        takeUntil(this.componentDestroyed)
      )
      .subscribe(params => {
        const tabIndex = params['tabIndex'] || 0;
        if (this.tabs.tabs[tabIndex]) {
          this.tabs.tabs[tabIndex].active = true;
        }
      });

    this.needRefresh.pipe(takeUntil(this.componentDestroyed)).subscribe(_ => {
      this.getPatientInfo();
    });

    this.initialiseValues();

    this.initialiseDropdowns();

    this.subscribeValueChanges();
    this.getPatientInfo();
  }

  ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.unsubscribe();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.tabs.tabs.forEach((tab, index) => {
      if (tab.active) {
        switch (index) {
          case 0:
          case 1:
            console.log('on patient detail page;', this.patientDetailFormGroup);
            if (event.keyCode === 115 && this.patientDetailFormGroup.valid) {
              this.hotKeySaveOnHistoryDetailTab = false;
              if (index === 0) {
                this.updatePatient();
              } else {
                this.assignPolicy();
              }
            }
            break;
          case 2:
            // case 3:
            console.log('on documents page or patient history page;');
            this.hotKeySaveOnHistoryDetailTab = true;
            break;
        }
      }
    });
  }

  getPatientInfo() {
    if (this.store.getPatientId()) {
      // Get Patient Details
      this.apiPatientInfoService.searchBy('systemuserid', this.store.getPatientId()).subscribe(
        res => {
          this.patientInfo = res.payload;
          console.log('PATIENT INFO', this.patientInfo);

          // Get Patient's Medical Coverage Details
          this.apiPatientInfoService.searchAssignedPoliciesByUserId(this.patientInfo['userId']).subscribe(
            resp => {
              if (resp.payload) {
                this.coverages = new MedicalCoverageResponse(
                  resp.payload.INSURANCE,
                  resp.payload.CORPORATE,
                  resp.payload.CHAS,
                  resp.payload.MEDISAVE
                );
                this.populateData(this.coverages);
                this.updateFormGroup();
              }
            },
            err => this.alertService.error(JSON.stringify(err))
          );
        },
        err => {
          this.alertService.error(JSON.stringify(err));
          this.store.setPatientId('');
          this.router.navigate(['pages/patient/detail']);
        }
      );

      this.getAlerts();
      this.initHistoryList();
    } else {
      alert('No Patient Details');
      this.router.navigate(['pages/patient/list']);
    }
  }

  initialiseValues() {
    this.policyHolderInfo = this.fb.array([]);

    this.patientService.resetPatientDetailFormGroup();
    this.patientDetailFormGroup = this.patientService.getPatientDetailFormGroup();
    if (!this.patientDetailFormGroup.get('selectedPlans').value) {
      this.initSelectedPlans();
    }
  }

  initialiseDropdowns() {
    this.allergyTypes = this.utilsService.mapToDisplayOptions(ALLERGY_TYPES);
    this.allergyNames = this.utilsService.mapToDisplayOptions(ALLERGIES);
    this.medicalAlertTypes = this.utilsService.mapToDisplayOptions(ALERT_TYPES);
    this.medicalAlertPriorities = this.utilsService.mapToDisplayOptions(ALERT_PRIORITY);
  }

  initSelectedPlans() {
    (<FormArray>this.patientDetailFormGroup.get('selectedPlans')).push(
      this.fb.group({
        medicalCoverageId: '',
        planId: '',
        patientCoverageId: '',
        coverageType: '',
        isNew: false,
        startDate: '',
        endDate: '',
        remarks: '',
        costCenter: '',
        coverageSelected: this.fb.group(new MedicalCoverageSelected()),
        planSelected: this.fb.group(new CoverageSelected())
      })
    );
  }

  getAlerts() {
    this.apiPatientInfoService.listAlert(this.store.getPatientId()).subscribe(
      res => {
        if (res.payload) {
          const tempAlerts = res.payload.details;
          tempAlerts.forEach(alerts => {
            if (
              this.medicalAlertTypes.find(function(x) {
                return x.value === alerts.alertType;
              })
            ) {
              this.medicalAlerts.push(alerts);
            }
          });
        }
      },
      error => {}
    );
  }
  setOnTabSelected(index: number) {
    this.isInHistoryListTab = index === 2;
    this.shouldShowPrintLabelBtn = index === 0;
  }

  onBtnPrintPatientLabelClicked() {
    this.printTemplateService.onBtnPrintPatientLabelClicked(this.patientInfo);
  }

  showAddConfirmation() {
    const initialState = {
      title: 'Confirmation of Patient Visit',
      selectedCoverages: this.fb.array([])
    };

    this.confirmationBsModalRef = this.modalService.show(PatientAddQueueConfirmationComponent, {
      initialState,
      class: 'modal-lg'
    });

    this.confirmationBsModalRef.content.event.subscribe(data => {
      if (data) {
        console.log('Patient Search Data', data);
        this.addPatientToRegistry(this.store.getPatientId(), data);
      } else {
        console.log('No data emitted');
      }
      this.confirmationBsModalRef.content.event.unsubscribe();
      this.confirmationBsModalRef.hide();
    });
  }

  // Fire initCreatAPI
  addPatientToRegistry(patientId: string, data) {
    const patientRegistryEntry: PatientVisit = new PatientVisit(
      new PatientVisitRegistryEntity(
        patientId,
        this.store.getClinicId(),
        data.preferredDoctor,
        data.purposeOfVisit,
        data.priority
      ),
      data.attachedMedicalCoverages.map(value => value.planId)
    );

    console.log('patient to be added to registry', patientRegistryEntry);
    this.apiPatientVisitService.initCreate(patientRegistryEntry).subscribe(
      res => {
        console.log('Added patient into registry');
        if (res) {
          console.log(res);
          this.router.navigate(['patient']);
        }
      },
      err => this.alertService.error(JSON.stringify(err))
    );
  }

  createCoverageSelectedFB(address, contacts, policyHolder): FormGroup {
    const p = policyHolder;
    const formGroup = this.fb.group({
      address: address,
      contacts: this.medicalCoverageFormService.createContacts(contacts),
      costCenter: p.costCenter,
      id: p.id,
      identificationNumber: this.fb.group({
        idType: p.identificationNumber.idType,
        number: p.identificationNumber.number
      }),
      medicalCoverageId: p.medicalCoverageId,
      name: p.name,
      patientCoverageId: p.patientCoverageId,
      planId: p.planId,
      specialRemarks: p.specialRemarks,
      startDate: p.startDate,
      status: p.status
    });

    return formGroup;
  }

  populateData(payload: MedicalCoverageResponse) {
    console.log('PAYLOAD: ', payload);

    for (const key of Object.keys(payload)) {
      if (payload[key].length > 0) {
        payload[key].forEach(element => {
          const policyHolder = element.policyHolder;

          this.policyHolderInfo.push(this.medicalCoverageFormService.createCoverageSelectedFB(policyHolder));

          const medicalCoverageSelected =
            this.store.getPlansByCoverageId(element.policyHolder.medicalCoverageId).length === 0
              ? new MedicalCoverageSelected()
              : <MedicalCoverageSelected>this.store.getPlansByCoverageId(element.policyHolder.medicalCoverageId);
          const plan = new SelectedPlan(
            false,
            policyHolder.medicalCoverageId,
            policyHolder.patientCoverageId,
            '',
            policyHolder.planId,
            medicalCoverageSelected,
            element.coveragePlan,
            policyHolder.costCenter,
            key,
            policyHolder.startDate,
            policyHolder.endDate,
            false,
            policyHolder.specialRemarks
          );

          (<FormArray>this.patientDetailFormGroup.get('selectedPlans')).push(this.fb.group(plan));
        });
      }
    }
    return this.patientDetailFormGroup.get('selectedPlans').value;
  }

  // Action
  onBtnBackClicked() {
    this.location.back();
  }

  assignPolicy() {
    const newPolicyHolders = [];
    const newPolicyTypes = [];

    const currentPolicyHolders = [];
    const currentPolicyTypes = [];
    const plans = this.patientDetailFormGroup.get('selectedPlans').value;

    if (plans.length < 1) {
      this.endUpdating();
      return;
    }

    // if (plans.length > 0) {
    plans.forEach((plan, index) => {
      console.log('plan: ', plan);
      if (plan.isNew) {
        console.log('PLAN IS NEW!');

        const holderDetails = {
          identificationNumber: {
            idType: this.patientInfo.userId.idType,
            number: this.patientInfo.userId.number
          },
          name: this.patientInfo.name,
          medicalCoverageId: plan.medicalCoverageId,
          planId: plan.planId,
          patientCoverageId: plan.patientCoverageId,
          specialRemarks: plan.remarks,
          status: 'ACTIVE',
          startDate: plan.startDate,
          endDate: plan.endDate,
          costCenter: plan.costCenter
        };
        const policyType = plan.coverageType;

        newPolicyHolders.push(holderDetails);
        newPolicyTypes.push(policyType);
      } else {
        const today = moment().format(DISPLAY_DATE_FORMAT);
        const endDate = plan.coverageSelected.endDate;

        const policyExpired = !moment(today, DISPLAY_DATE_FORMAT).isSameOrBefore(moment(endDate, DISPLAY_DATE_FORMAT));
        if (!policyExpired) {
          const policyHolder = this.policyHolderInfo.value.find(function(x) {
            return x.planId === plan.planId && x.medicalCoverageId === plan.medicalCoverageId;
          });

          const holderDetails = {
            id: policyHolder.id,
            identificationNumber: {
              idType: this.patientInfo.userId.idType,
              number: this.patientInfo.userId.number
            },
            name: this.patientInfo.name,
            medicalCoverageId: plan.medicalCoverageId,
            planId: plan.planId,
            patientCoverageId: plan.patientCoverageId,
            specialRemarks: plan.remarks,
            status: policyHolder.status,
            startDate: plan.startDate,
            endDate: plan.endDate,
            costCenter: plan.costCenter
          };
          const policyType = plan.coverageType;

          currentPolicyHolders.push(holderDetails);
          currentPolicyTypes.push(policyType);
        }
      }
      this.selectedCoverageType.add(plan.coverageType);
    });

    // Skip updating policy when nothing new, and update patient instead
    if (newPolicyHolders.length < 1 && currentPolicyHolders.length < 1) {
      this.endUpdating();
      return;
    }

    forkJoin(
      currentPolicyHolders.map((plan, index) =>
        this.apiPatientInfoService.editPolicy(
          currentPolicyTypes[index],
          currentPolicyHolders[index].id,
          currentPolicyHolders[index]
        )
      )
    ).subscribe(
      arr => {
        console.log('updated policy holders');
        this.endUpdating();
      },
      err => this.alertService.error(JSON.stringify(err.error['message']))
    );

    forkJoin(
      newPolicyHolders.map((plan, index) =>
        this.apiPatientInfoService.assignPolicy(newPolicyTypes[index], newPolicyHolders[index])
      )
    ).subscribe(
      arr => {
        //this.addPatientToRegistry();
        this.endUpdating();
        // this.router.navigate(['patient']);
      },
      err => this.alertService.error(JSON.stringify(err.error['message']))
    );
  }

  endUpdating() {
    alert("Patient's details has been updated.");
    this.router.navigate(['patient']);
  }

  enforcePolicy(plans) {}

  // Main
  updateFormGroup() {
    const patientInfo = this.patientInfo;
    const alertArray = this.patientDetailFormGroup.get('alertFormGroup').get('alertArray') as FormArray;
    const medicalAlertArray = this.patientDetailFormGroup.get('medicalAlertFormGroup').get('alertArray') as FormArray;

    this.patientDetailFormGroup.get('headerFormGroup').patchValue({
      name: patientInfo.name
    });
    this.patientDetailFormGroup.get('alertFormGroup').patchValue({
      state: ''
    });
    this.patientDetailFormGroup.get('medicalAlertFormGroup').patchValue({
      state: ''
    });

    patientInfo.allergies.forEach(allergy => {
      alertArray.push(this.formatAlertArrayItem(allergy));
    });

    this.medicalAlerts.forEach(alert => {
      medicalAlertArray.push(this.formatMedicalAlertArrayItem(alert));
    });

    const birth = patientInfo.dob ? moment(patientInfo.dob, DISPLAY_DATE_FORMAT).toDate() : '';
    this.patientDetailFormGroup.get('basicInfoFormGroup').patchValue(
      {
        title: patientInfo.title,
        name: patientInfo.name,
        //birth: new Date(parseInt(birth[2]), parseInt(birth[1]) - 1, parseInt(birth[0])),
        birth,
        gender: patientInfo.gender,
        country: patientInfo.address.country,
        race: patientInfo.race,
        nationality: patientInfo.nationality,
        status: patientInfo.maritalStatus,
        language: patientInfo.preferredLanguage,
        primary: patientInfo.contactNumber
          ? this.utilsService.formatToE164PhoneNumber(patientInfo.contactNumber.number)
          : '',
        secondary: patientInfo.secondaryNumber
          ? this.utilsService.formatToE164PhoneNumber(patientInfo.secondaryNumber.number)
          : '',
        line1: patientInfo.address.address ? patientInfo.address.address.split('\n')[0] : '',
        line2: patientInfo.address.address
          ? patientInfo.address.address.split('\n')[1] !== 'undefined'
            ? patientInfo.address.address.split('\n')[1]
            : ''
          : '',
        postCode: patientInfo.address.postalCode,
        email: patientInfo.emailAddress,
        communicationMode: patientInfo.preferredMethodOfCommunication,
        consentGiven: patientInfo.consentGiven
      },
      { emitEvent: false }
    );

    this.patientDetailFormGroup
      .get('basicInfoFormGroup')
      .get('fullId')
      .patchValue(
        {
          id: patientInfo.userId.number,
          idType: patientInfo.userId.idType
          // selectedCountry: patientInfo.address.country
        },
        { emitEvent: false }
      );

    this.storedPatientID = patientInfo.userId.number;
    this.storedPatientIDType = patientInfo.userId.idType;

    this.patientDetailFormGroup.get('companyInfoFormGroup').patchValue(
      {
        company: patientInfo.company ? patientInfo.company.name : '',
        occupation: patientInfo.company ? patientInfo.company.occupation : '',
        line1: patientInfo.company.address ? patientInfo.company.address.split('\n')[0] : '',
        line2: patientInfo.company.address ? patientInfo.company.address.split('\n')[1] : '',
        postCode: patientInfo.company ? patientInfo.company.postalCode : ''
      },
      { emitEvent: false }
    );

    if (
      patientInfo.emergencyContactNumber &&
      patientInfo.emergencyContactNumber.relationship &&
      patientInfo.emergencyContactNumber.relationship !== ''
    ) {
      this.patientDetailFormGroup.get('emergencyContactFormGroup').patchValue(
        {
          name: patientInfo.emergencyContactNumber.name,
          contact: patientInfo.emergencyContactNumber.number,
          relationship: patientInfo.emergencyContactNumber.relationship
        },
        { emitEvent: false }
      );
    } else {
      this.patientDetailFormGroup.get('emergencyContactFormGroup').patchValue({}, { emitEvent: false });
    }

    // const startDate = moment()
    //   .subtract(6, 'months')
    //   .format(DISPLAY_DATE_FORMAT);
    // const endDate = moment().format(DISPLAY_DATE_FORMAT);
    // this.apiPatientVisitService.listAllFiles(this.store.getPatientId(), startDate, endDate).subscribe(
    //   res => {
    //     const payload = res.payload;
    //     const flattenPayload = payload.reduce((documents, documentGroup) => {
    //       documentGroup.fileMetaData.forEach(file => {
    //         file.localDate = documentGroup.localDate;
    //         file.listType = documentGroup.listType;
    //         file.patientVisitId = documentGroup.patientVisitId || '';
    //       });
    //       documents = documents.concat(documentGroup.fileMetaData);
    //       return documents;
    //     }, []);
    //     const allDocuments = flattenPayload.reduce((allDocuments, documents) => allDocuments.concat(documents), []);
    //     this.patientDocuments = allDocuments;
    //     // this.updateDocumentList('patient');
    //   },
    //   err => this.alertService.error(JSON.stringify(err))
    // );

    this.patientDetailFormGroup.get('historyFilterFormGroup').patchValue({
      doctors: {
        value: this.store.getDoctorList().map(doctor => {
          return { value: doctor.id, label: doctor.name };
        })
      }
    });

    this.patientDetailFormGroup.patchValue({ needRefresh: false });
    this.patientService.setPatientDetailFormGroup(this.patientDetailFormGroup);

    // console.log("Patient ")
  }

  subscribeValueChanges() {
    console.log('Patient Detail Form ', this.patientDetailFormGroup.controls);

    const alertFormGroup = this.patientDetailFormGroup.get('alertFormGroup');
    const medicalAlertFormGroup = this.patientDetailFormGroup.get('medicalAlertFormGroup');
    const alertArray = alertFormGroup.get('alertArray') as FormArray;
    const medicalAlertArray = medicalAlertFormGroup.get('alertArray') as FormArray;
    const fullIdArrayFormGroup = this.patientDetailFormGroup.get('basicInfoFormGroup').get('fullId');

    alertFormGroup.valueChanges
      .pipe(
        debounceTime(50),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.componentDestroyed)
      )
      .subscribe(values => {
        if (values.isAdd) {
          alertFormGroup.patchValue({
            isAdd: false
          });
          alertArray.push(this.newAlertArrayItem());
        }
      });

    medicalAlertFormGroup.valueChanges
      .pipe(
        debounceTime(50),
        distinctUntilChanged(),
        takeUntil(this.componentDestroyed)
      )
      .subscribe(values => {
        console.log('ENTERED HERE');
        if (values.isAdd) {
          medicalAlertFormGroup.patchValue({
            isAdd: false
          });
          medicalAlertArray.push(this.newMedicalAlertArrayItem());
        }
      });

    fullIdArrayFormGroup.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.componentDestroyed)
      )
      .subscribe(values => {
        this.patientInfo.userId.number = values.id;
        this.patientInfo.userId.idType = values.idType;
      });

    this.patientDetailFormGroup
      .get('basicInfoFormGroup')
      .valueChanges.pipe(
        debounceTime(50),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.componentDestroyed)
      )
      .subscribe(values => {
        this.patientInfo.title = values.title;
        this.patientInfo.name = values.name;
        this.patientInfo.dob = moment(values.birth).format(DISPLAY_DATE_FORMAT);
        this.patientInfo.gender = values.gender;
        this.patientInfo.nationality = values.nationality;
        this.patientInfo.maritalStatus = values.status;
        this.patientInfo.address.country = values.country;
        this.patientInfo.race = values.race;
        this.patientInfo.preferredLanguage = values.language;

        // Added in after merging contactDetailFormGroup into basicInfoFormGroup
        this.patientInfo.contactNumber.number = values.primary;

        let tempSec: string = values.secondary;
        tempSec = tempSec.trim();

        if (tempSec) {
          if (this.patientInfo.secondaryNumber) {
            this.patientInfo.secondaryNumber.number = values.secondary;
          } else {
            const secondaryNumber = { number: values.secondary };
            this.patientInfo['secondaryNumber'] = secondaryNumber;
          }
        } else {
          this.patientInfo.secondaryNumber = {
            number: ''
          };
        }
        this.patientDetailFormGroup
          .get('basicInfoFormGroup')
          .get('primary')
          .markAsTouched();
        this.patientDetailFormGroup
          .get('basicInfoFormGroup')
          .get('secondary')
          .markAsTouched();
        this.patientInfo.address.postalCode = values.postCode;
        this.patientInfo.emailAddress = values.email;
        this.patientInfo.preferredMethodOfCommunication = values.communicationMode;
        this.patientInfo.consentGiven = values.consentGiven;

        if (values.postCode) {
          this.patientDetailFormGroup
            .get('basicInfoFormGroup')
            .get('postCode')
            .setAsyncValidators(
              this.patientService.findAddress(
                this.apiCmsManagementService,
                this.patientDetailFormGroup.get('basicInfoFormGroup').get('postCode'),
                this.patientDetailFormGroup.get('basicInfoFormGroup').get('line1'),
                this.patientDetailFormGroup.get('basicInfoFormGroup').get('line2'),
                <FormGroup>this.patientDetailFormGroup.get('basicInfoFormGroup')
              )
            );

          this.patientInfo.address.address = values.line1 + (values.line1.endsWith('\n') ? '' : '\n') + values.line2;
        } else {
          this.patientDetailFormGroup
            .get('basicInfoFormGroup')
            .get('postCode')
            .clearAsyncValidators();

          this.patientInfo.address.address = values.line1 + (values.line1.endsWith('\n') ? '' : '\n') + values.line2;
        }

        console.log('Patient Detail Form Group: ', this.patientDetailFormGroup);
      });

    this.patientDetailFormGroup
      .get('companyInfoFormGroup')
      .valueChanges.pipe(
        debounceTime(50),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.componentDestroyed)
      )
      .subscribe(values => {
        this.patientInfo.company.name = values.company;
        this.patientInfo.company.occupation = values.occupation;
        this.patientInfo.company.postalCode = values.postCode;

        if (values.postCode) {
          this.patientDetailFormGroup
            .get('companyInfoFormGroup')
            .get('postCode')
            .setAsyncValidators(
              this.patientService.findAddress(
                this.apiCmsManagementService,
                this.patientDetailFormGroup.get('companyInfoFormGroup').get('postCode'),
                this.patientDetailFormGroup.get('companyInfoFormGroup').get('line1'),
                this.patientDetailFormGroup.get('companyInfoFormGroup').get('line2'),
                <FormGroup>this.patientDetailFormGroup.get('companyInfoFormGroup')
              )
            );

          this.patientInfo.company.address = values.line1 + (values.line1.endsWith('\n') ? '' : '\n') + values.line2;
        } else {
          this.patientDetailFormGroup
            .get('companyInfoFormGroup')
            .get('postCode')
            .clearAsyncValidators();

          this.patientInfo.company.address = values.line1 + (values.line1.endsWith('\n') ? '' : '\n') + values.line2;
        }
      });
    this.patientDetailFormGroup
      .get('emergencyContactFormGroup')
      .valueChanges.pipe(
        debounceTime(50),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.componentDestroyed)
      )
      .subscribe(values => {
        if (!this.patientInfo.emergencyContactNumber) {
          const emergencyContactNumber = { name: '', contact: '', relationship: '' };
          this.patientInfo.emergencyContactNumber = emergencyContactNumber;
        }

        this.patientInfo.emergencyContactNumber.name = values.name;
        this.patientInfo.emergencyContactNumber.number = values.contact;
        this.patientInfo.emergencyContactNumber.relationship = values.relationship ? values.relationship : null;
      });
    // this.patientDetailFormGroup
    //   .get('documentsFormGroup')
    //   .get('filter')
    //   .valueChanges.pipe(
    //     debounceTime(50),
    //     distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    //   )
    //   .subscribe(values => this.updateDocumentList('patient'));
    // this.patientDetailFormGroup
    //   .get('documentsFormGroup')
    //   .get('dateRange')
    //   .valueChanges.pipe(
    //     debounceTime(50),
    //     distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    //   )
    //   .subscribe(values => {
    //     const startDate = moment(values[0]).format(DISPLAY_DATE_FORMAT);
    //     const endDate = moment(values[1]).format(DISPLAY_DATE_FORMAT);
    //     this.apiPatientVisitService.listAllFiles(this.store.getPatientId(), startDate, endDate).subscribe(
    //       res => {
    //         const payload = res.payload;
    //         const flattenPayload = payload.reduce((documents, documentGroup) => {
    //           documentGroup.fileMetaData.forEach(file => {
    //             file.localDate = documentGroup.localDate;
    //             file.listType = documentGroup.listType;
    //           });
    //           documents = documents.concat(documentGroup.fileMetaData);
    //           return documents;
    //         }, []);
    //         const allDocuments = flattenPayload.reduce((allDocuments, documents) => allDocuments.concat(documents), []);
    //         this.patientDocuments = allDocuments;
    //         // this.updateDocumentList('patient');
    //       },
    //       err => this.alertService.error(JSON.stringify(err))
    //     );
    //   });
    this.patientDetailFormGroup
      .get('historyFilterFormGroup')
      .valueChanges.pipe(
        debounceTime(50),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.componentDestroyed)
      )
      .subscribe(values => {
        this.updateHistoryList();
      });
    this.patientDetailFormGroup.valueChanges
      .pipe(
        distinctUntilChanged((a, b) => a.historyDetailIndex === b.historyDetailIndex),
        takeUntil(this.componentDestroyed)
      )
      .subscribe(values => {
        if (!values.isHistoryList && values.historyDetailIndex !== -1) {
          this.clearHistoryDetailFormGroupArrays();

          const historyArray = this.patientDetailFormGroup.get('historyListFormGroup').get('formArray') as FormArray;
          const history = this.histories[values.historyDetailIndex];
          console.log('HISTORY', history);
          this.store.setPatientVisitRegistryId(history.visitId);

          if (!history.medicalReferenceEntity.consultation) {
            return;
          }
          const consultation = history.medicalReferenceEntity.consultation;

          const historyDetailFormGroup = this.patientDetailFormGroup.get('historyDetailFormGroup');
          const diagnosisArray = historyDetailFormGroup.get('diagnosisArray') as FormArray;
          const itemArray = historyDetailFormGroup.get('itemArray') as FormArray;
          const documentsArray = historyDetailFormGroup.get('documentsArray') as FormArray;
          const certificateArray = historyDetailFormGroup.get('certificateArray') as FormArray;

          historyDetailFormGroup.patchValue(
            {
              ...historyArray.at(values.historyDetailIndex).value,
              patientInfo: this.patientInfo,
              consultationInfo: consultation,
              doctorId: consultation.doctorId,
              purpose: history.visitPurpose ? history.visitPurpose : '',
              notes: consultation.consultationNotes || '',
              startTime: history.startTime ? moment(history.startTime, 'DD-MM-YYYYTHH:mm:ss').format('HH:mm') : '-',
              endTime: history.endTime ? moment(history.endTime, 'DD-MM-YYYYTHH:mm:ss').format('HH:mm') : '-',
              timeChitFrom:
                history.visitTimeChit && history.visitTimeChit.from
                  ? moment(history.visitTimeChit.from, 'DD-MM-YYYYTHH:mm:ss').format('HH:mm')
                  : '',
              timeChitTo:
                history.visitTimeChit && history.visitTimeChit.to
                  ? moment(history.visitTimeChit.to, 'DD-MM-YYYYTHH:mm:ss').format('HH:mm')
                  : '',
              followupConsultationFormGroup: {
                id: '',
                patientId: '',
                patientVisitId: '',
                followupDate: '',
                remarks: ''
              }
            },
            { emitEvent: false }
          );

          if (consultation.followupConsultation) {
            this.patientDetailFormGroup.patchValue(
              {
                historyDetailFormGroup: {
                  followupConsultationFormGroup: consultation.followupConsultation
                }
              },
              { emitEvent: false }
            );
          }

          if (consultation.patientReferral) {
            let doctor;
            let clinic;
            let str = '';

            const patientReferrals = history.medicalReferenceEntity.patientReferral.patientReferrals;
            patientReferrals.map(element => {
              element.appointmentDateTime = element.appointmentDateTime ? element.appointmentDateTime : '';
              element.clinicId = element.clinicId ? element.clinicId : '';
              element.doctorId = element.doctorId ? element.doctorId : '';
              element.externalReferral = element.externalReferral ? element.externalReferral : false;
              element.memo = element.memo ? element.memo : '';
              element.practice = element.practice ? element.practice : '';

              element.externalReferralDetails = element.externalReferralDetails
                ? element.externalReferralDetails
                : { address: '', doctorName: '', phoneNumber: '' };

              doctor = this.store.getDoctorList().find(doctor => doctor.id === element.doctorId);
              if (!doctor) {
                doctor = { name: '' };
              }
              clinic = this.store.getClinicList().find(clinic => clinic.id === element.clinicId);
              if (!clinic) {
                clinic = new ClinicOnly();
              }

              const appointmentDateTime = element.appointmentDateTime ? element.appointmentDateTime : '';
              const clinicId = element.clinicId ? element.clinicId : '';
              const doctorId = element.doctorId ? element.doctorId : '';
              const externalReferral = element.externalReferral ? element.externalReferral : '';
              const memo = element.memo ? element.memo : '';
              const practice = element.practice ? element.practice : '';

              const address = element.externalReferralDetails.address ? element.externalReferralDetails.address : '';
              const doctorName = element.externalReferralDetails.doctorName
                ? element.externalReferralDetails.doctorName
                : '';
              const phoneNumber = element.externalReferralDetails.phoneNumber
                ? element.externalReferralDetails.phoneNumber
                : '';

              const externalReferralDetails = this.fb.group({
                address: address,
                doctorName: doctorName,
                phoneNumber: phoneNumber
              });

              element.externalReferralDetails = element.externalReferralDetails
                ? element.externalReferralDetails
                : externalReferralDetails;

              if (!element.externalReferral) {
                str = element.memo
                  ? `Referral letter to ${doctor.name} (${clinic.name}@${clinic.address.address || ''} Singapore ${
                      clinic.address.postalCode
                    })`
                  : '';
                element.str = str;
              } else {
                str = element.memo
                  ? `Referral letter to ${element.externalReferralDetails.doctorName} (${
                      element.externalReferralDetails.address
                    })`
                  : '';
                element.str = str;
              }

              const referralObj = this.fb.group({
                appointmentDateTime: appointmentDateTime,
                clinicId: clinicId,
                doctorId: doctorId,
                externalReferral: externalReferral,
                memo: memo,
                practice: practice,
                externalReferralDetails: externalReferralDetails,
                str
              });
            });
            const referralArray = historyDetailFormGroup.get('referralArray') as FormArray;
            patientReferrals.forEach(referralObj => {
              referralArray.push(this.fb.group(referralObj));
            });
          }

          const diagnosis = history.medicalReferenceEntity.diagnosisIds;
          diagnosis.forEach(diagnosisItem => {
            diagnosisArray.push(
              this.fb.group({
                // icd: diagnosisItem.icd10Code,
                // description: diagnosisItem.icd10Term
                id: diagnosisItem
              })
            );
          });

          const items = history.medicalReferenceEntity.dispatchItemEntities;
          items.forEach(item => {
            const itemDetail = this.store.chargeItemList
              .map(item => item.item)
              .find(detail => detail.id === item.itemId);
            itemArray.push(
              this.fb.group({
                itemCode: itemDetail.code,
                uom: item.dosageUom,
                dosage: item.dosage,
                instruct: item.instruct,
                duration: item.duration,
                quantity: item.quantity,
                quantityUom: itemDetail.salesUom,
                batchNo: item.batchNo,
                expiryDate: item.expiryDate,
                remarks: item.remarks
              })
            );
          });

          if (this.store.getPatientVisitRegistryId()) {
            this.apiPatientVisitService.listDocuments('visit', this.store.getPatientVisitRegistryId()).subscribe(
              res => {
                const documents = (this.visitDocuments = res.payload.visitDocuments);
                if (documents && documents.length) {
                  documents.forEach(document => {
                    documentsArray.push(
                      this.fb.group({
                        name: document.name,
                        document: document.fileName,
                        description: document.description,
                        type: document.type,
                        size: document.size,

                        fileId: document.fileId,
                        clinicId: document.clinicId
                      })
                    );
                  });
                  historyDetailFormGroup
                    .get('filter')
                    .valueChanges.pipe(
                      debounceTime(50),
                      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
                    )
                    .subscribe(
                      res => {
                        this.updateDocumentList('visit');
                      },
                      err => this.alertService.error(JSON.stringify(err))
                    );
                }
              },
              err => this.alertService.error(JSON.stringify(err))
            );
          }

          this.patientDetailFormGroup.patchValue(
            {
              historyDetailFormGroup: {
                clinicNotes: consultation.clinicNotes || '',
                memo: consultation.memo || ''
              }
            },
            { emitEvent: false }
          );

          const certificates = history.medicalReferenceEntity.medicalCertificates;
          if (certificates) {
            certificates.forEach(certificate => {
              const {
                purpose,
                startDate,
                numberOfDays,
                otherReason,
                referenceNumber,
                halfDayOption,
                remark
              } = certificate;

              const adjustedEndDate = numberOfDays - 1 >= 0 ? numberOfDays - 1 : 0;
              const endDate = moment(startDate, DISPLAY_DATE_FORMAT)
                .add(adjustedEndDate, 'days')
                .format(DISPLAY_DATE_FORMAT);
              certificateArray.push(
                this.fb.group({
                  purpose,
                  startDate,
                  endDate,
                  numberOfDays,
                  referenceNumber,
                  otherReason: otherReason || '',
                  str: `${purpose} for ${numberOfDays} day(s) from ${startDate} to ${endDate}`,
                  halfDayOption,
                  remark: remark || ''
                })
              );
            });
          }
        }
      });
  }

  initHistoryList() {
    if (!this.isHistoryListInit) {
      this.getHistoryList(0);
    }
  }

  reloadCurrentHistoryPage() {
    this.getHistoryList(this.historyPage.pageNumber);
  }

  getHistoryList(pageOffset: number) {
    this.historyPage.pageNumber = pageOffset;
    this.apiPatientVisitService.getPatientVisitHistoryPage(this.store.getPatientId(), this.historyPage).subscribe(
      res => {
        this.histories = res.payload
          .filter(
            history =>
              history.visitStatus === 'POST_CONSULT' ||
              history.visitStatus === 'PAYMENT' ||
              history.visitStatus === 'COMPLETE'
          )
          .sort((a, b) => {
            const momentA = moment(a.medicalReferenceEntity.consultation.consultationStartTime, DB_FULL_DATE_FORMAT);
            const momentB = moment(b.medicalReferenceEntity.consultation.consultationStartTime, DB_FULL_DATE_FORMAT);
            return momentB.diff(momentA);
          });

        this.historyPage.pageNumber = res['pageNumber'];
        this.historyPage.totalPages = res['totalPages'];
        this.historyPage.totalElements = res['totalElements'];
        console.log(this.histories);
        this.isHistoryListInit = true;
        this.updateHistoryList();
      },
      err => this.alertService.error(JSON.stringify(err))
    );
  }

  updateDocumentList(type: string) {
    const formGroup =
      type === 'visit'
        ? this.patientDetailFormGroup.get('historyDetailFormGroup')
        : this.patientDetailFormGroup.get('documentsFormGroup');
    const documents =
      type === 'visit'
        ? this.visitDocuments.filter(document => document.name.includes(formGroup.get('filter').value))
        : this.patientDocuments.filter(document => document.fileName.includes(formGroup.get('filter').value));
    const documentsArray = formGroup.get('documentsArray') as FormArray;
    while (documentsArray.length) {
      documentsArray.removeAt(0);
    }
    documents.forEach(document => {
      documentsArray.push(
        this.fb.group({
          name: document.name || '',
          date: document.listType === 'VISIT' ? document.localDate || '' : '',
          document: document.fileName,
          description: document.description,
          type: document.type,
          size: document.size,
          listType: document.listType || '',
          patientVisitId: document.patientVisitId || '',

          fileId: document.fileId,
          clinicId: document.clinicId
        })
      );
    });
  }

  updateHistoryList() {
    const histories = this.histories;
    if (histories && histories.length) {
      const values = this.patientDetailFormGroup.get('historyFilterFormGroup').value;
      const historyArray = this.patientDetailFormGroup.get('historyListFormGroup').get('formArray') as FormArray;
      while (historyArray.length) {
        historyArray.removeAt(0);
      }
      histories.forEach(history => {
        if (!history.medicalReferenceEntity.consultation) {
          return;
        }
        const consultation = history.medicalReferenceEntity.consultation;
        const startTime = moment(consultation.consultationStartTime, DB_FULL_DATE_FORMAT);
        if (moment(values.dateFrom).isAfter(startTime)) {
          return;
        }
        if (
          moment(values.dateTo)
            .add(1, 'days')
            .isBefore(startTime)
        ) {
          return;
        }
        if (values.doctor && values.doctor !== consultation.doctorId) {
          return;
        }
        const doctor = this.store.getDoctorList().find(doctor => doctor.id === consultation.doctorId);
        const clinic = this.store.getClinicList().find(clinic => clinic.id === consultation.clinicId);

        historyArray.push(
          this.fb.group({
            date: moment(consultation.consultationStartTime, DB_FULL_DATE_FORMAT).format(DISPLAY_DATE_FORMAT),
            diagnosis: {
              value: history.medicalReferenceEntity.diagnosisIds
            },
            doctor: doctor ? doctor.name : '',
            clinic: clinic ? clinic.name : '',
            caseId: history.caseId || '',
            consultationStartTime: consultation.consultationStartTime ? consultation.consultationStartTime : '2345',
            consultationEndTime: consultation.consultationEndTime ? consultation.consultationEndTime : ''
          })
        );
      });
    }
  }

  clearHistoryDetailFormGroupArrays() {
    const historyDetailFormGroup = this.patientDetailFormGroup.get('historyDetailFormGroup');
    const arrayKeys = ['diagnosisArray', 'itemArray', 'documentsArray', 'certificateArray', 'referralArray'];
    arrayKeys.forEach(key => {
      const array = historyDetailFormGroup.get(key) as FormArray;
      while (array.length) {
        array.removeAt(0);
      }
    });
  }

  // Utils
  pick(obj: Object, keys): Object {
    return Object.keys(obj)
      .filter(key => keys.includes(key))
      .reduce((pickedObj, key) => {
        pickedObj[key] = obj[key];
        return pickedObj;
      }, {});
  }

  updatePatient() {
    const user = this.pick(this.patientInfo, PATIENT_INFO_KEYS);

    console.log('UPDATE USER', user);

    this.apiPatientInfoService.update(this.store.getPatientId(), user).subscribe(
      res => {
        this.endUpdating();
      },
      err => this.alertService.error(JSON.stringify(err))
    );
  }

  // Alert
  subscribeAlertArrayItemValueChanges(item: FormGroup, values) {
    if (values.isDelete) {
      this.patientInfo.allergies.splice(values.deleteIndex, 1);
      return;
    }

    const formArray = item.parent as FormArray;
    const index = formArray.value.map(values => JSON.stringify(values)).indexOf(JSON.stringify(values));
    const info = this.patientInfo.allergies[index];
    if (!info) {
      const updatedInfo = <any>{
        allergyType: values.type,
        name: values.name,
        remarks: values.remarks,
        addedDate: moment().format(DISPLAY_DATE_FORMAT)
      };
      this.patientInfo.allergies.push(updatedInfo);
    } else {
      info.allergyType = values.type;
      info.name = values.name;
      info.remarks = values.remarks;
    }
  }

  //Medical Alert
  subscribeMedicalArrayItemValueChanges(item: FormGroup, values) {
    const medicalAlertArray = this.patientDetailFormGroup.get('medicalAlertFormGroup').get('alertArray') as FormArray;

    if (values.isDelete) {
      this.medicalAlerts.splice(values.deleteIndex, 1);
      return;
    }

    if (values.alertId) {
      item.get('isEdit').patchValue(false);
    }

    const formArray = item.parent as FormArray;
    const index = formArray.value.map(arr => JSON.stringify(arr)).indexOf(JSON.stringify(values));
    const info = this.medicalAlerts[index];
    if (!info) {
      const updatedInfo = <any>{
        alertId: values.alertId,
        alertType: values.type,
        name: values.name,
        remark: values.remark,
        priority: values.priority,
        addedDate: values.addedDate,
        expiryDate: values.expiryDate
      };
      this.medicalAlerts.push(updatedInfo);
    } else {
      info.alertId = values.alertId;
      info.alertType = values.type;
      info.name = values.name;
      info.remark = values.remark;
      info.priority = values.priority;
      info.addedDate = values.addedDate;
      info.expiryDate = values.expiryDate;
    }
  }

  newAlertArrayItem() {
    const item = this.fb.group({
      types: { value: this.allergyTypes },
      type: ['', Validators.required],
      allergies: { value: this.allergyNames },
      name: ['', Validators.required],
      remarks: '',
      addedDate: moment().format(DISPLAY_DATE_FORMAT),

      isDelete: false,
      deleteIndex: -1
    });

    item.valueChanges
      .pipe(
        debounceTime(50),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.componentDestroyed)
      )
      .subscribe(values => this.subscribeAlertArrayItemValueChanges(item, values));

    return item;
  }

  formatAlertArrayItem(allergy) {
    const item = this.fb.group({
      types: { value: this.allergyTypes },
      type: [allergy.allergyType, Validators.required],
      allergies: { value: this.allergyNames },
      name: [allergy.name, Validators.required],
      remarks: allergy.remarks,
      addedDate: allergy.addedDate,

      isDelete: false,
      deleteIndex: -1
    });

    item.valueChanges
      .pipe(
        debounceTime(50),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.componentDestroyed)
      )
      .subscribe(values => this.subscribeAlertArrayItemValueChanges(item, values));

    return item;
  }

  newMedicalAlertArrayItem() {
    const item = this.fb.group({
      alertId: '',
      types: { value: this.medicalAlertTypes },
      type: '',
      name: ['', Validators.required],
      remark: '',
      priority: ['', Validators.required],
      priorityDropDown: { value: this.medicalAlertPriorities },
      isDelete: false,
      deleteIndex: -1,
      isEdit: true,
      addedDate: moment().format(DISPLAY_DATE_FORMAT),
      expiryDate: moment().format(DISPLAY_DATE_FORMAT)
    });

    item.valueChanges
      .pipe(
        debounceTime(50),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.componentDestroyed)
      )
      .subscribe(values => this.subscribeMedicalArrayItemValueChanges(item, values));
    return item;
  }

  formatMedicalAlertArrayItem(medicalAlert) {
    const item = this.fb.group({
      alertId: medicalAlert.alertId,
      types: { value: ALERT_TYPES },
      type: medicalAlert.alertType,
      name: medicalAlert.name,
      remark: medicalAlert.remark,
      priority: medicalAlert.priority,
      priorityDropDown: { value: ALERT_PRIORITY },
      isDelete: false,
      deleteIndex: -1,
      isEdit: false,
      addedDate: medicalAlert.addedDate,
      expiryDate: medicalAlert.expiryDate
    });

    item.valueChanges
      .pipe(
        debounceTime(50),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.componentDestroyed)
      )
      .subscribe(values => this.subscribeMedicalArrayItemValueChanges(item, values));

    return item;
  }
}
