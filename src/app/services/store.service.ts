import { UtilsService } from './utils.service';
import { DISPLAY_DATE_FORMAT, DB_FULL_DATE_FORMAT } from './../constants/app.constants';
import { StoreStatus } from './../objects/StoreStatus';
import { Practice } from './../objects/SpecialityByClinic';
import { Router } from '@angular/router';
import { Observable, Subject, timer, BehaviorSubject } from 'rxjs';
import { Clinic } from './../objects/response/Clinic';
import { Injectable, OnDestroy } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';

import { LoggerService } from './logger.service';
import { ApiPatientVisitService } from './api-patient-visit.service';
import { ApiPatientInfoService } from './api-patient-info.service';
import { AllergyGroup } from './../objects/response/AllergyGroup';
import { PatientRegistryListResponse } from './../objects/response/PatientRegistryListResponse';
import { AuthService } from './auth.service';
import { User } from './../objects/response/User';

import { Instruction, DosageInstruction } from './../objects/DrugItem';
import { Uom } from './../objects/Uom';
import { MedicalCoverageSelected } from './../objects/MedicalCoverage';

import { AlertService } from '../services/alert.service';
import { ApiCmsManagementService } from '../services/api-cms-management.service';

import { PatientService } from '../services/patient.service';
import { PaymentService } from '../services/payment.service';

import * as moment from 'moment';
import { VitalConfiguration } from '../objects/response/VitalConfiguration';

@Injectable()
export class StoreService implements OnDestroy {
  private isClinicLoaded = new Subject();
  private headerRegistry = new Subject();
  private isStoreReady: BehaviorSubject<StoreStatus>;
  private patientIdRefresh = new Subject<string>();
  private patientVisitIdRefresh = new Subject<string>();
  currentPatientId = this.patientIdRefresh.asObservable();

  currentConsultationRoute = 'route1';

  private patientId: string;
  private _caseId: string;
  private queueNumber: string;
  private visitStatus: string;

  consultationId: string;
  private patientVisitRegistryId: string;
  private user: User;

  medicalCoverageList: Array<MedicalCoverageSelected> = [];
  medicalCoverageListWithExpired: Array<MedicalCoverageSelected> = [];
  visitPurposeList = [];

  authorizedClinicList = [];
  private clinicList = new Array<Clinic>();

  doctorList = [];
  doctorListByClinic = [];
  clinicId: string;
  clinicCode: string;
  clinic: Clinic;

  chargeItemList = [];
  activeChargeItemList = [];
  chargeItemListOptions = [];
  allergyGroupList: AllergyGroup[] = [];
  allergyGroupListOptions = [];

  uoms: Array<Uom> = new Array();

  specialitiesList: Practice[];

  patientRegistry: Array<PatientRegistryListResponse>;

  errorMessages = [];

  notificationList = [];
  unreadNotificationList = [];
  notificationPolling: any;
  registryPolling: any;

  private templates: {};
  private instructions: Array<Instruction>;
  private dosageInstructions: Array<DosageInstruction>;
  vitalConfigurations: Array<VitalConfiguration>;
  vitalConfigurationsForAdd: Array<VitalConfiguration>;

  // Store Status
  private storeSuccessCount = 0;
  private storeFailCount = 0;
  private storeStatus: StoreStatus;
  private API_COUNTS = 10;

  constructor(
    private permissionsService: NgxPermissionsService,
    private authService: AuthService,
    private alertService: AlertService,
    private apiCmsManagementService: ApiCmsManagementService,
    private apiPatientInfoService: ApiPatientInfoService,
    private patientService: PatientService,
    private paymentService: PaymentService,
    private utilsService: UtilsService,
    private apiPatientVisitService: ApiPatientVisitService,
    private logger: LoggerService,
    private router: Router
  ) {
    this.storeStatus = new StoreStatus(false, false, false);
    this.isStoreReady = new BehaviorSubject(this.storeStatus);

    if (
      localStorage.getItem('access_token') &&
      localStorage.getItem('clinicCode') &&
      localStorage.getItem('clinicId')
    ) {
      this.clinicCode = localStorage.getItem('clinicCode');
      this.clinicId = localStorage.getItem('clinicId'); // preInit would have been called
    } else {
      console.log("can't");
    }

    this.preInit();
  }

  preInit() {
    console.log('Store pre-Init');
    this.storeSuccessCount = 0;
    this.storeFailCount = 0;
    this.storeStatus.hasError = false;
    this.storeStatus.isLoaded = false;
    this.storeStatus.isReseting = true;
    this.isStoreReady.next(this.storeStatus);
    if (this.authService.isAuthenticated()) {
      this.authService.getUser().subscribe(
        res => {
          this.logger.info('USER', res.payload);
          this.user = res.payload;
          localStorage.setItem('roles', JSON.stringify(this.user.roles));
          this.permissionsService.loadPermissions(this.user.roles);
          this.authService.permissionsLoaded = true;
          this.listTemplates();
          this.initStore();
        },
        err => this.alertService.error(JSON.stringify(err))
      );
    }
  }

  refreshPatientId(patientId: string) {
    this.patientIdRefresh.next(patientId);
  }

  refreshPatientVisitId(patientVisitId: string) {
    this.patientVisitIdRefresh.next(patientVisitId);
  }

  ngOnDestroy() {
    this.unsubscribeNotificationPolling();
    this.unsubscribeRegistryPolling();
  }

  initStore() {
    this.authService.isLogout().subscribe(data => {
      this.logoutClearUp();
    });
    this.alertService.getMessage().subscribe(msg => console.log(msg));

    this.apiCmsManagementService.listClinics().subscribe(
      res => {
        if (res.payload) {
          this.clinicList = res.payload;
          console.log('GOT CLINIC LIST: ', res.payload);
          // this.clinicclinic = res.payload;
          this.isClinicLoaded.next(res.payload);
          console.log('111 ai ISCLINICLOADED: ', res.payload);
          this.isClinicLoaded.complete();
          this.clinic = this.clinicList.find(clinic => clinic.id === this.clinicId);
          this.setStoreReady(true);
        }
      },
      err => {
        this.alertService.error(JSON.stringify(err));
        this.errorMessages['listClinics'] = err;
        this.setStoreReady(false);
      }
    );

    this.apiCmsManagementService.listVisitPurposes().subscribe(
      res => {
        console.log('GOT VISIT PURPOSE LIST');
        this.visitPurposeList = res.payload;
        this.setStoreReady(true);
      },
      err => {
        this.alertService.error(JSON.stringify(err));
        this.errorMessages['listVisitPurposes'] = err;
        this.setStoreReady(false);
      }
    );
    this.apiCmsManagementService.listDoctors().subscribe(
      res => {
        this.doctorList = res.payload;
        this.setStoreReady(true);
      },
      err => {
        console.log('ERROR IN RETRIEVING DOCTOR LIST,', err);
        this.alertService.error(JSON.stringify(err));
        this.errorMessages['listDoctorsByClinic'] = err;
        this.setStoreReady(false);
      }
    );
    this.listDoctorsByClinic();

    this.apiPatientInfoService.listAllergyGroups().subscribe(
      res => {
        console.log('GOT ALLERGY GROUP LIST');
        this.allergyGroupList = res.payload;
        this.allergyGroupListOptions = this.allergyGroupList.map(allergy => {
          return {
            value: allergy.id,
            label: allergy.groupCode
          };
        });
        this.setStoreReady(true);
      },
      err => {
        this.alertService.error(JSON.stringify(err));
        this.errorMessages['listAllergyGroups'] = err;
        this.setStoreReady(false);
      }
    );
    this.apiCmsManagementService.listSpecialities().subscribe(
      data => {
        if (data.payload) {
          // this.populatePractice(data.payload);
          this.specialitiesList = data.payload;
        }
        this.setStoreReady(true);
      },
      err => {
        this.alertService.error(JSON.stringify(err.error.message));
        this.setStoreReady(false);
      }
    );

    this.apiCmsManagementService.listMedicalCoveragesWithPagination(0, 10000).subscribe(
      res => {
        console.log('GOT MEDICAL COVERAGE LIST');
        console.log('res payload: ', res.payload.content);

        const data = res.payload.content;
        const today = moment();

        this.medicalCoverageListWithExpired = data;
        // console.log("today: ", today);
        data.forEach(item => {
          const isValid = this.utilsService.validateDates(today, moment(item.endDate, DISPLAY_DATE_FORMAT));
          if (item.coveragePlans.length !== 0) {
            if (isValid) {
              this.medicalCoverageList.push(item);
            }
          }
        });

        this.medicalCoverageList.map(item => {
          return {
            name: item.name,
            coveragePlans: item.coveragePlans.map(plan => plan.name)
          };
        });

        this.setStoreReady(true);
      },
      err => {
        this.alertService.error(JSON.stringify(err));
        this.errorMessages['listMedicalCoveragesWithPagination'] = err;
        this.setStoreReady(false);
      }
    );

    this.apiCmsManagementService.listInstructions().subscribe(
      data => {
        const { payload } = data;
        if (payload) {
          this.instructions = payload['INSTRUCTIONS'] ? payload['INSTRUCTIONS'] : [];
          this.dosageInstructions = payload['DOSAGE_INSTRUCTIONS'] ? payload['DOSAGE_INSTRUCTIONS'] : [];
          this.uoms = payload['UOMS'] ? payload['UOMS'] : [];
          console.log('DOSAGE INSTRUCTIONS', this.instructions, this.dosageInstructions);
        }
        this.setStoreReady(true);
      },
      err => {
        this.alertService.error(JSON.stringify(err.error.message));
        this.setStoreReady(false);
      }
    );

    this.apiCmsManagementService.listChargeItems().subscribe(
      res => {
        console.log('GOT CHARGE ITEM LIST');
        this.chargeItemList = res.payload;
        this.activeChargeItemList = this.chargeItemList.filter(item => {
          if (item.item.status === 'ACTIVE') {
            return item;
          }
        });
        this.chargeItemListOptions = this.chargeItemList.map(item => {
          return {
            value: item.id,
            label: item.name
            // code: item.code
          };
        });
        this.setStoreReady(true);
      },
      err => {
        this.alertService.error(JSON.stringify(err));
        this.errorMessages['listChargeItems'] = err;
        this.setStoreReady(false);
      }
    );

    this.getVitalConfigurations();

    // this.updatePatientRegistryList();
    this.startHeaderRegistryPolling();
    this.startNotificationPolling();
  }

  listDoctorsByClinic() {
    if (this.clinicId) {
      this.apiCmsManagementService.listDoctorsByClinic(this.clinicId).subscribe(
        res => {
          console.log('GOT DOCTOR LIST', res.payload);
          this.doctorListByClinic = res.payload;
          this.setStoreReady(true);
        },
        err => {
          console.log('ERROR IN RETRIEVEING DOCTOR LIST,', err);
          this.alertService.error(JSON.stringify(err));
          this.errorMessages['listDoctors'] = err;
          this.setStoreReady(false);
        }
      );
    }
  }

  setStoreReady(hasSucceeded: boolean) {
    if (hasSucceeded) {
      this.storeSuccessCount++;
    } else {
      this.storeFailCount++;
    }

    console.log('isStoreReady Count', this.storeSuccessCount, this.storeFailCount);

    if (this.storeSuccessCount >= this.API_COUNTS) {
      this.storeStatus.hasError = false;
      this.storeStatus.isLoaded = true;
      this.storeStatus.isReseting = false;
      console.log('​StoreService -> setStoreReady -> this.storeStatus', this.storeStatus);
      this.isStoreReady.next(this.storeStatus);
    } else if (this.storeSuccessCount + this.storeFailCount === this.API_COUNTS) {
      this.storeStatus.hasError = true;
      this.storeStatus.isLoaded = true;
      this.storeStatus.isReseting = false;
      console.log('​StoreService -> setStoreReady -> this.storeStatus(fail)', this.storeStatus);
      this.isStoreReady.next(this.storeStatus);
    }
  }

  getStoreStatus(): StoreStatus {
    return this.storeStatus;
  }

  startHeaderRegistryPolling() {
    if (!this.registryPolling) {
      this.registryPolling = timer(0, 20000).subscribe(val => {
        this.updatePatientRegistryList();
      });
    }
  }

  unsubscribeNotificationPolling() {
    if (this.notificationPolling) {
      this.notificationPolling.unsubscribe();
      this.notificationPolling = null;
    }
  }

  startNotificationPolling() {
    if (!this.notificationPolling) {
      this.notificationPolling = timer(1000, 20000).subscribe(val => {
        this.updateNotificationList();
      });
    }
  }

  unsubscribeRegistryPolling() {
    if (this.registryPolling) {
      this.registryPolling.unsubscribe();
      this.registryPolling = null;
    }
  }

  getMedicalCoveragesWithPagination() {
    this.apiCmsManagementService.listMedicalCoverages().subscribe(
      res => {
        console.log('GOT MEDICAL COVERAGE LIST---', res.payload.content);
        this.medicalCoverageList = res.payload.content;
        console.log(
          this.medicalCoverageList.map(item => {
            return {
              name: item.name,
              coveragePlans: item.coveragePlans.map(plan => plan.name)
            };
          })
        );
      },
      err => {
        this.alertService.error(JSON.stringify(err));
        this.errorMessages['getMedicalCoveragesWithPagination'] = err;
      }
    );
  }

  getVitalConfigurations() {
    this.apiCmsManagementService.listAllVitalConfigurations().subscribe(
      res => {
        if (res.payload) {
          console.log('​StoreService -> getVitalConfigurations -> res.payload', res.payload);
          // this.vitalConfigurationsForAdd = [];
          this.vitalConfigurationsForAdd = [];
          res.payload.forEach(vital => {
            const newVital = Object.assign({}, vital);
            this.vitalConfigurationsForAdd.push(newVital);
          });

          this.vitalConfigurations = [];
          res.payload.forEach(vital => {
            const newVital = Object.assign({}, vital);
            this.vitalConfigurations.push(newVital);
          });
          console.log('​StoreService -> getVitalConfigurations -> this.vitalConfigurations', this.vitalConfigurations);
          this.setStoreReady(true);
        }
      },
      err => {
        this.errorMessages['getVitalConfiguration'] = err;
        this.setStoreReady(false);
      }
    );
  }

  getAuthorizedClinicList() {
    const tempArray = [];

    if (this.user) {
      this.clinicList.map(clinic => {
        clinic.clinicStaffUsernames.forEach(staffUsername => {
          if (staffUsername === this.user.userName) {
            tempArray.push(clinic);
          } else {
          }
        });
      });
    }
    this.authorizedClinicList = tempArray;
    return tempArray;
  }

  getAllergyGroupList() {
    this.apiPatientInfoService.listAllergyGroups().subscribe(
      res => {
        console.log('GOT ALLERGY GROUP LIST');
        this.allergyGroupList = res.payload;
        this.allergyGroupListOptions = this.allergyGroupList.map(allergy => {
          return {
            value: allergy.id,
            label: allergy.groupCode
          };
        });
      },
      err => {
        this.alertService.error(JSON.stringify(err));
        this.errorMessages['listAllergyGroups'] = err;
      }
    );
  }

  getVisitPurposeList() {
    this.apiCmsManagementService.listVisitPurposes().subscribe(
      res => {
        console.log('GOT VISIT PURPOSE LIST');
        this.visitPurposeList = res.payload;
      },
      err => {
        this.alertService.error(JSON.stringify(err));
        this.errorMessages['listVisitPurposes'] = err;
      }
    );
  }

  getListOfDoctors() {
    this.apiCmsManagementService.listDoctors().subscribe(
      res => {
        console.log('GOT DOCTOR PURPOSE LIST', res.payload);
        this.doctorList = res.payload;
      },
      err => {
        this.alertService.error(JSON.stringify(err));
        this.errorMessages['listDoctors'] = err;
      }
    );
  }

  updatePatientRegistryList() {
    if (this.clinicId) {
      this.apiPatientVisitService
        .patientRegistryListWithStartTime(
          this.clinicId,
          moment()
            .startOf('day')
            .format(DB_FULL_DATE_FORMAT),
          moment()
            .endOf('day')
            .format(DB_FULL_DATE_FORMAT)
        )
        .subscribe(
          data => {
            if (data.payload) {
              this.patientRegistry = [...data.payload];
              this.patientRegistry = data.payload;
              this.logger.info('Patient Registry', this.patientRegistry);
              this.headerRegistry.next(this.patientRegistry);
            }
          },
          err => this.alertService.error(JSON.stringify(err))
        );
    }
  }

  listTemplates() {
    if (this.permissionsService.getPermission('ROLE_CONSULTATION_TEMPLATE')) {
      this.apiCmsManagementService.listTemplates(this.getUser().context['cms-user-id']).subscribe(
        res => {
          if (res.payload && res.payload.templates) {
            this.setTemplates(res.payload.templates);
          }
        },
        err => {
          this.alertService.error(JSON.stringify(err));
        }
      );
    }
  }

  findClinic(clinicId: string) {
    return this.clinicList.find(element => element.id === clinicId);
  }

  getDoctors() {
    return this.doctorList;
  }

  getActiveDoctors() {
    return this.doctorList.filter(element => element.status === 'ACTIVE');
  }

  findDoctorById(doctorId: string) {
    return this.doctorList.find(element => element.id === doctorId);
  }

  getUser(): User {
    return this.user;
  }

  getUserId(): string {
    return this.user.context['cms-user-id'];
  }

  getUserLabel(): string {
    return this.user ? this.user.userName.slice(0, 1).toUpperCase() : '';
  }

  getClinicId(): string {
    return this.clinicId;
  }

  getClinic(): Clinic {
    return this.clinicList.find(clinic => clinic.id === this.clinicId);
  }

  getPatientId(): string {
    return this.patientId;
  }

  getPatientVisitRegistryId(): string {
    return this.patientVisitRegistryId;
  }

  getConsultationId(): string {
    return this.consultationId;
  }

  getPlansByCoverageId(medicalCoverageId: string) {
    // return this.getPlanByCoverageId(this.medicalCoverageList, medicalCoverageId);
    return this.getPlanByCoverageId(this.medicalCoverageListWithExpired, medicalCoverageId);
  }

  getPlanByCoverageId(medicalCoverages, medicalCoverageId: string) {
    return medicalCoverages.filter(elem => elem.id === medicalCoverageId);
  }

  getPlan(medicalCoverageId: string, planId: string) {
    const coverage = this.getPlansByCoverageId(medicalCoverageId);
    if (coverage.length === 0) {
      return {
        id: '0',
        name: 'CASH',
        coveragePlans: [
          {
            id: '0'
          }
        ]
      };
    }
    const plan = this.getPlanFromCoveragesByPlanId(coverage[0].coveragePlans, planId);
    coverage[0].coveragePlans = plan;
    return coverage[0];
  }

  getMedicalCoverages() {
    return this.medicalCoverageList;
  }

  getMedicalCoverageByPlanId(planId) {
    return this.medicalCoverageListWithExpired.find(element => {
      const plan = element.coveragePlans.find(childElement => childElement.id === planId);
      // console.log('search plan', plan)
      return plan ? true : false;
    });
  }

  getCoverageByPlanId(planId) {
    // let coverage = '';
    let coverage = null;
    this.medicalCoverageListWithExpired.forEach(element => {
      console.log('​StoreService -> getCoverageByPlanId -> element', element);
      const _coverage = element.coveragePlans.find(childElement => childElement.id === planId);
      // console.log('search plan', plan)

      if (_coverage) {
        console.log('​StoreService -> getCoverageByPlanId -> coverage', coverage);
        coverage = _coverage;
        return;
      }
    });

    return coverage;
  }

  getPlanFromCoveragesByPlanId(plans, planId: string) {
    return plans.filter(elem => elem.id === planId);
  }

  getClinicList(page: number = 0, size: number = 10000) {
    return this.clinicList.slice(size * page, size * (page + 1));
  }

  getDoctorList(page: number = 0, size: number = 10000) {
    if (this.doctorList.length === 0) {
      console.log('GETTING DOCTORS');
      this.getListOfDoctors();
    } else {
      return this.doctorList.slice(size * page, size * (page + 1));
    }
  }

  getPatientIdRefresh() {
    return this.patientIdRefresh;
  }

  getPatientVisitIdRefresh() {
    console.log('RETURNING  VISIT ID: ', this.patientVisitIdRefresh);
    return this.patientVisitIdRefresh;
  }

  setPatientId(id: string) {
    console.log('SETTING PATIENT ID: ', id);
    this.patientId = id;
    this.patientService.resetPatientDetailFormGroup();
    this.patientIdRefresh.next(this.patientId);
  }

  setPatientVisitRegistryId(id: string) {
    console.log('SETTING VISIT ID: ', id);
    this.patientVisitRegistryId = id;
    this.patientVisitIdRefresh.next(id);
    this.paymentService.resetChargeFormGroup();
    this.paymentService.resetCollectFormGroup();
  }

  setConsultationId(id: string) {
    this.consultationId = id;
    this.paymentService.resetChargeFormGroup();
    this.paymentService.resetCollectFormGroup();
  }

  getNotificationList() {
    return this.notificationList;
  }

  getUnreadNotificationList() {
    return this.unreadNotificationList;
  }

  getIsClinicLoaded(): Observable<any> {
    console.log('111 aisClinic)');
    return this.isClinicLoaded.asObservable();
  }

  getDoctorId() {
    return this.getUser().context['cms-user-id'];
  }

  resetClinicLoaded() {
    this.isClinicLoaded = new Subject();
  }

  getHeaderRegistry() {
    return this.headerRegistry.asObservable();
  }

  resetHeaderRegistry() {
    this.headerRegistry = new Subject();
  }

  getIsStoreReady(): Observable<any> {
    return this.isStoreReady.asObservable();
  }

  resetIsStoreReady() {
    this.isStoreReady = new BehaviorSubject(this.storeStatus);
  }

  updateNotificationList() {
    if (this.authService.isAuthenticated()) {
      this.apiPatientInfoService.listNotifications().subscribe(res => {
        this.notificationList = res.payload;
        this.unreadNotificationList = this.notificationList.filter(notification => !notification.read);
      });
    } else {
      this.unsubscribeNotificationPolling();
    }
  }

  updateUnreadNotificationList() {
    this.unreadNotificationList = this.notificationList.filter(notification => !notification.read);
  }

  logoutClearUp() {
    this.unsubscribeNotificationPolling();
    this.unsubscribeRegistryPolling();
    this.clinicCode = '';
    this.clinicId = '';
    this.router.navigate(['login']);
    this.storeSuccessCount = 0;
  }

  getTemplates() {
    return this.templates;
  }

  setTemplates(templates) {
    this.templates = templates;
  }

  getInstructions(): Array<Instruction> {
    return this.instructions;
  }
  getDosageInstructions(): Array<DosageInstruction> {
    return this.dosageInstructions;
  }

  getCaseId(): string {
    return this._caseId;
  }
  setCaseId(value: string) {
    this._caseId = value;
  }

  getVisitStatus(): string {
    return this.visitStatus;
  }
  setVisitStatus(value: string) {
    this.visitStatus = value;
  }

  getQueueNumber(): string {
    return this.queueNumber;
  }
  setQueueNumber(value: string) {
    this.queueNumber = value;
  }
}
