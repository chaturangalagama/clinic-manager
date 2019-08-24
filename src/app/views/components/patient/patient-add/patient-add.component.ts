import { MedicalCoverageFormService } from './../../../../services/medical-coverage-form.service';
import { UtilsService } from './../../../../services/utils.service';
import { MedicalAlerts } from './../../../../objects/request/MedicalAlerts';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { forkJoin } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { SelectedPlans } from '../../../../objects/MedicalCoverage';
import { PatientVisit, PatientVisitRegistryEntity } from '../../../../objects/request/PatientVisit';
import { UserRegistration } from '../../../../objects/UserRegistration';
import { ApiPatientInfoService } from '../../../../services/api-patient-info.service';
import { ApiPatientVisitService } from '../../../../services/api-patient-visit.service';
import { ApiCmsManagementService } from './../../../../services/api-cms-management.service';
import { PatientService } from '../../../../services/patient.service';
import {
  DISPLAY_DATE_FORMAT,
  ALLERGY_TYPES,
  ALERT_PRIORITY,
  ALERT_TYPES,
  ALLERGIES
} from './../../../../constants/app.constants';
import { SelectedPlan } from './../../../../objects/MedicalCoverage';
import { AlertService } from './../../../../services/alert.service';
import { StoreService } from './../../../../services/store.service';
import { SelectedItem } from './../../medical-coverage/assign-medical-coverage/assign-medical-coverage.component';
import {
  UserRegistrationObject,
  Company,
  UserId,
  Address,
  Contact,
  EmergencyContactNumber
} from '../../../../objects/UserRegistrationObject';
import { PatientAddQueueConfirmationComponent } from '../../../../components/patient-add/patient-add-queue-confirmation/patient-add-queue-confirmation.component';
@Component({
  selector: 'app-patient-add',
  templateUrl: './patient-add.component.html',
  styleUrls: ['./patient-add.component.scss']
})
export class PatientAddComponent implements OnInit {
  patientAddFormGroup: FormGroup;
  patientInfo = [
    {
      title: '',
      preferredMethodOfCommunication: '',
      consentGiven: true,
      race: '',
      preferredLanguage: '',
      name: '',
      companyId: '',
      dob: '',
      idType: '',
      idNumber: '',
      country: '',
      countryCode: 65,
      gender: '',
      contactNumber: '',
      status: '',
      address: '',
      postcode: '',
      email: '',
      emergencyContact: { name: '', contact: '', relationship: null },
      company: {
        company: '',
        address: '',
        postalCode: '',
        occupation: ''
      },
      nationality: '',
      maritalStatus: '',
      allergies: [],
      medicalAlerts: [],
      patientID: '',
      patientNumber: ''
    }
  ];

  patientVisitEntry: PatientVisit;
  bsConfig: Partial<BsDatepickerConfig>;

  error: string;

  // Medical Coverage
  coverageBsModalRef: BsModalRef;
  specialRemarks: string;
  startDate: Date;
  endDate: Date;
  selectedMedicalCoverage: any;
  selectedCoverageType = new Set();

  // Medical Alerts
  medicalAlerts: MedicalAlerts[] = [];
  // Confirmation
  confirmationBsModalRef: BsModalRef;
  confirmationInput: SelectedItem[];

  // Registry Entry
  preferredDoctorId: string;
  registryRemarks: string;
  purposeOfVisit: string;
  priority: string;
  // @Input() attachedMedicalCoverages: FormArray;

  plans: SelectedPlans[] = [];
  newPlans: SelectedPlan[] = [];
  attachedPlans;
  selectedPlans: Array<SelectedPlan> = new Array<SelectedPlan>();
  attachedPlansForConsultation;

  constructor(
    private apiPatientService: ApiPatientVisitService,
    private apiPatientInfoService: ApiPatientInfoService,
    private apiCmsManagementService: ApiCmsManagementService,
    private patientService: PatientService,
    private medicalCoverageFormService: MedicalCoverageFormService,
    private store: StoreService,
    private alertService: AlertService,
    private modalService: BsModalService,
    private utilsService: UtilsService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue' });
  }

  ngOnInit() {
    if (this.store.getClinicId() !== '' || this.store.getClinicId() === undefined) {
      if (localStorage.getItem('clinicId')) {
        this.store.clinicId = localStorage.getItem('clinicId');
      }
    }

    this.patientService.resetPatientAddFormGroup();
    this.patientAddFormGroup = this.patientService.getPatientAddFormGroup();
    this.subscribeValueChanges();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === 115) {
      console.log('F4');
      if (this.patientAddFormGroup.valid) {
        this.onBtnNextClicked('');
      }
    }
  }

  onBtnNextClicked(event) {
    const initialState = {
      title: 'Confirmation of Patient Visit',
      patientPlans: <FormArray>this.patientAddFormGroup.get('selectedPlans'),
      attachedMedicalCoverages: <FormArray>this.patientAddFormGroup.get('attachedPlans').value
    };

    this.confirmationBsModalRef = this.modalService.show(PatientAddQueueConfirmationComponent, {
      initialState,
      class: 'modal-lg'
    });

    this.confirmationBsModalRef.content.event.subscribe(data => {
      if (data) {
        this.confirmationInput = data;
        this.preferredDoctorId = data.preferredDoctor;
        this.registryRemarks = data.remarks;
        this.purposeOfVisit = data.purposeOfVisit;
        this.priority = data.priority;
        this.attachedPlansForConsultation = data.attachedMedicalCoverages;
        this.newPlans = this.patientAddFormGroup.get('selectedPlans').value;
        this.attachedPlans = data.attachedMedicalCoverages;
      } else {
        console.log('No data emitted');
      }

      this.confirmationBsModalRef.content.event.unsubscribe();
      this.confirmationBsModalRef.hide();

      this.registerSubmit();
    });
  }

  subscribeValueChanges() {
    const patientInfo = this.patientInfo;
    const alertFormGroup = this.patientAddFormGroup.get('alertFormGroup');
    const medicalAlertFormGroup = this.patientAddFormGroup.get('medicalAlertFormGroup');
    const alertArray = alertFormGroup.get('alertArray') as FormArray;
    const medicalAlertArray = medicalAlertFormGroup.get('alertArray') as FormArray;

    // Medical Coverages
    this.patientAddFormGroup.get('medicalCoverageFormGroup').valueChanges.subscribe(values => {
      this.selectedMedicalCoverage = values.selectedPlans;
      // this.createMedicalCoverages(this.selectedMedicalCoverage);

      this.plans = this.medicalCoverageFormService.patchMCValuesToPlans(this.selectedMedicalCoverage);
    });

    this.patientAddFormGroup
      .get('selectedPlans')
      .valueChanges.pipe(
        debounceTime(50),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe(values => {
        console.log('VALUE CHANGES: ', values);
        this.patientAddFormGroup.get('selectedPlans').updateValueAndValidity();
      });

    // Allergy
    alertFormGroup.valueChanges
      .pipe(
        debounceTime(50),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe(values => {
        if (values.isAdd) {
          alertFormGroup.patchValue({
            isAdd: false
          });
          alertArray.push(this.newAllergyAlertArrayItem());
        }
      });

    // Medical Alert
    medicalAlertFormGroup.valueChanges
      .pipe(
        debounceTime(50),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe(values => {
        if (values.isAdd) {
          medicalAlertFormGroup.patchValue({
            isAdd: false
          });
          medicalAlertArray.push(this.newMedicalAlertArrayItem());
        }
      });
  }

  checkPatientData(): UserRegistration {
    this.checkBasicInfo();
    this.checkEmergencyContactInfo();
    this.checkCompanyInfo();
    this.checkOtherInfo();

    const pInfo = this.patientInfo[0];
    console.log('pInfo: ', pInfo);

    let {
      title,
      preferredMethodOfCommunication,
      name,
      dob,
      gender,
      email,
      nationality,
      maritalStatus,
      race,
      preferredLanguage,
      allergies,
      consentGiven
    } = pInfo;
    const company = new Company(
      pInfo.company.company,
      pInfo.company.address,
      pInfo.company.postalCode,
      pInfo.company.occupation
    );
    const address = new Address(pInfo.address, pInfo.country ? pInfo.country : 'Singapore', pInfo.postcode);
    const userId = new UserId(pInfo.idType, pInfo.idNumber);
    const contactNumber = new Contact(65, pInfo.contactNumber);
    const emergencyContact = new EmergencyContactNumber(
      65,
      pInfo.emergencyContact.contact,
      pInfo.emergencyContact.name,
      pInfo.emergencyContact.relationship
    );

    const user = new UserRegistrationObject(
      '',
      this.store.getPatientId(),
      title,
      preferredMethodOfCommunication,
      consentGiven,
      name,
      dob,
      userId,
      gender,
      contactNumber,
      'ACTIVE',
      address,
      email,
      emergencyContact,
      company,
      nationality,
      maritalStatus,
      race,
      preferredLanguage,
      allergies,
      '',
      ''
    );

    if (!user.emergencyContactNumber.relationship) {
      delete user['emergencyContactNumber'];
    }

    console.log('user: ', user);

    delete user['companyId'];
    delete user['id'];
    delete user['patientNumber'];

    return user;
  }

  registerSubmit() {
    const user = this.checkPatientData();

    this.apiPatientInfoService.register(user).subscribe(
      res => {
        this.patientInfo[0].patientID = res.payload.id;
        if (this.patientInfo[0].patientID) {
          if (this.addMedicalAlerts()) {
            console.log('Patient registered and medical alerts added successfully');
          } else {
            console.log('Patient registered successfully, but unable to add medical alerts');
          }
        } else {
          console.log('Patient ID not found');
        }

        if ((<FormArray>this.patientAddFormGroup.get('selectedPlans')).length > 0) {
          this.assignPolicy();
        } else {
          this.addPatientToRegistry([]);
        }
      },
      err => {
        this.alertService.error(JSON.stringify(err.error.message));
      }
    );
  }

  checkBasicInfo() {
    const patientInfo = this.patientInfo;
    const values = this.patientAddFormGroup.get('basicInfoFormGroup').value;

    patientInfo[0].country = values.country;
    patientInfo[0].title = values.title;
    patientInfo[0].name = values.name;
    patientInfo[0].gender = values.gender;
    patientInfo[0].contactNumber = values.contactNumber;
    patientInfo[0].countryCode = values.contactNumber;
    patientInfo[0].dob = moment(values.birthday).format(DISPLAY_DATE_FORMAT);
    patientInfo[0].address = values.address1 + '\n' + values.address2;
    patientInfo[0].email = values.email;
    patientInfo[0].maritalStatus = values.maritalStatus;
    patientInfo[0].postcode = values.postcode;
    patientInfo[0].preferredMethodOfCommunication = values.preferredMethodOfCommunication;
    patientInfo[0].consentGiven = values.consentGiven;
    patientInfo[0].idNumber = values.fullId.id;
    patientInfo[0].idType = values.fullId.idType;
  }

  checkEmergencyContactInfo() {
    const patientInfo = this.patientInfo;
    const values = this.patientAddFormGroup.get('emergencyContactFormGroup').value;

    patientInfo[0].emergencyContact.name = values.name;
    patientInfo[0].emergencyContact.contact = values.contact;
    patientInfo[0].emergencyContact.relationship = values.relationship;
  }

  checkOtherInfo() {
    const patientInfo = this.patientInfo;
    const values = this.patientAddFormGroup.get('otherInfoFormGroup').value;

    patientInfo[0].nationality = values.nationality;
    patientInfo[0].race = values.race;
    patientInfo[0].preferredLanguage = values.preferredLanguage;
  }

  checkCompanyInfo() {
    const patientInfo = this.patientInfo;
    const values = this.patientAddFormGroup.get('companyInfoFormGroup').value;

    patientInfo[0].company.company = values.company;
    patientInfo[0].company.occupation = values.occupation;
    patientInfo[0].company.address = values.address1 + '\n' + values.address2;
    patientInfo[0].company.postalCode = values.postalCode;
  }

  addMedicalAlerts(): Boolean {
    if (this.patientInfo[0].medicalAlerts.length > 0) {
      console.log('ADDING MEDICAL ALERTS: ', this.patientInfo[0].medicalAlerts);
      this.apiPatientInfoService.addAlert(this.patientInfo[0].patientID, this.patientInfo[0].medicalAlerts).subscribe(
        arr => {
          console.log('success in adding');
          return true;
        },
        err => {
          if (err.error.message === 'Alert already assigned') {
            console.log('IGNORE ALERT ------> Alert already assign <---------');
          } else {
            this.alertService.error(JSON.stringify(err.error.message));
            return false;
          }
        }
      );
    } else {
      console.log('no need to map anything');
    }
    return false;
  }

  assignPolicy() {
    const policyHolders = [];
    const policyTypes = [];
    const plans = this.patientAddFormGroup.get('selectedPlans').value;
    console.log('ATTACHED PLANS: ', plans);
    console.log('ATTACHED MEDICAL COVERAGE: ', this.patientAddFormGroup.get('attachedPlans').value);

    plans.forEach(plan => {
      const holderDetails = {
        identificationNumber: {
          idType: this.patientInfo[0].idType,
          number: this.patientInfo[0].idNumber
        },
        name: this.patientInfo[0].name,
        medicalCoverageId: plan.medicalCoverageId,
        planId: plan.planId,
        patientCoverageId: plan.patientCoverageId,
        specialRemarks: plan.remarks,
        status: 'ACTIVE',
        startDate: plan.startDate,
        endDate: plan.endDate,
        costCenter: plan.costCenter
      };
      const policyType = plan.coverageSelected.type;

      policyHolders.push(holderDetails);
      policyTypes.push(policyType);

      this.selectedCoverageType.add(plan.coverageType);
    });

    forkJoin(
      policyHolders.map((plan, index) =>
        this.apiPatientInfoService.assignPolicy(policyTypes[index], policyHolders[index])
      )
    ).subscribe(
      arr => {
        console.log('POLICY RESULTS: ', arr);

        const policies = arr || [];
        this.addPatientToRegistry(policies);
      },
      err => {
        this.alertService.error(JSON.stringify(err.error.message));
      }
    );
  }

  addPatientToRegistry(policies) {
    console.log('thisattachedplan: ', this.attachedPlans);

    const planIds: Array<string> = [];

    if (this.attachedPlans.length > 0) {
      this.attachedPlans.forEach(plan => {
        const p = policies.find(function(policy) {
          console.log('p: ', p);
          return policy.payload.medicalCoverageId === plan.medicalCoverageId && policy.payload.planId === plan.planId;
        });

        if (p && p.payload && p.payload.planId) {
          planIds.push(p.payload.planId);
        }
      });
    }

    const patientRegistryEntry: PatientVisit = new PatientVisit(
      new PatientVisitRegistryEntity(
        this.patientInfo[0].patientID,
        this.store.clinicId,
        this.preferredDoctorId,
        this.purposeOfVisit,
        this.priority
      ),
      planIds
    );

    console.log('PATIENT REIGSTRY:', patientRegistryEntry);

    this.apiPatientService.initCreate(patientRegistryEntry).subscribe(
      res => {
        console.log('Added patient into registry: ', res);
        if (res) {
          console.log(res);
          this.router.navigate(['patient']);
        }
      },
      err => {
        this.alertService.error(JSON.stringify(err.error.message));
      }
    );
  }

  // managing allergy alerts
  newAllergyAlertArrayItem() {
    const types = this.utilsService.convertStringArrayToMenuOptions(ALLERGY_TYPES);
    const allergies = this.utilsService.convertStringArrayToMenuOptions(ALLERGIES);

    const item = this.fb.group({
      types: { value: types },
      type: ['', Validators.required],
      allergies: { value: allergies },
      name: ['', Validators.required],
      remarks: '',
      addedDate: moment().format(DISPLAY_DATE_FORMAT),

      isDelete: false,
      deleteIndex: -1
    });

    item.valueChanges
      .pipe(
        debounceTime(50),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe(values => this.subscribeAlertArrayItemValueChanges(item, values));

    return item;
  }

  formatAlertArrayItem(allergy) {
    const types = this.utilsService.convertStringArrayToMenuOptions(ALLERGY_TYPES);
    const allergies = this.utilsService.convertStringArrayToMenuOptions(ALLERGIES);

    const item = this.fb.group({
      types: { value: types },
      type: [allergy.allergyType, Validators.required],
      allergies: { value: allergies },
      name: [allergy.name, Validators.required],
      remarks: allergy.remarks,
      addedDate: allergy.addedDate,

      isDelete: false,
      deleteIndex: -1
    });

    item.valueChanges
      .pipe(
        debounceTime(50),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe(values => this.subscribeAlertArrayItemValueChanges(item, values));

    return item;
  }

  subscribeAlertArrayItemValueChanges(item: FormGroup, values) {
    const pInfo = this.patientInfo[0];

    if (values.isDelete) {
      pInfo.allergies.splice(values.deleteIndex, 1);
      return;
    }

    const formArray = item.parent as FormArray;
    const index = formArray.value.map(arr => JSON.stringify(arr)).indexOf(JSON.stringify(values));
    const info = pInfo.allergies[index];
    if (!info) {
      const updatedInfo = <any>{
        allergyType: values.type,
        name: values.name,
        remarks: values.remarks,
        addedDate: moment().format(DISPLAY_DATE_FORMAT)
      };
      pInfo.allergies.push(updatedInfo);
    } else {
      info.allergyType = values.type;
      info.name = values.name;
      info.remarks = values.remarks;
      info.addedDate = values.addedDate;
    }
  }

  // managing medical alerts
  newMedicalAlertArrayItem() {
    const types = this.utilsService.convertStringArrayToMenuOptions(ALERT_TYPES);
    const priorities = this.utilsService.convertStringArrayToMenuOptions(ALERT_PRIORITY);

    const item = this.fb.group({
      types: { value: types },
      type: '',
      name: ['', Validators.required],
      remark: '',
      priority: ['', Validators.required],
      priorityDropDown: { value: priorities },
      addedDate: moment().format(DISPLAY_DATE_FORMAT),
      isDelete: false,
      deleteIndex: -1,
      isEdit: true
    });

    console.log('item added: ', item);

    item.valueChanges
      .pipe(
        debounceTime(50),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe(values => this.subscribeMedicalAlertArrayItemValueChanges(item, values));

    return item;
  }

  formatMedicalAlertArrayItem(medicalAlert) {
    const types = this.utilsService.convertStringArrayToMenuOptions(ALERT_TYPES);
    const priorities = this.utilsService.convertStringArrayToMenuOptions(ALERT_PRIORITY);

    const item = this.fb.group({
      types: { value: types },
      type: medicalAlert.type,
      name: medicalAlert.name,
      remarks: medicalAlert.remarks,
      priority: medicalAlert.priority,
      priorityDropDown: { value: priorities },
      addedDate: medicalAlert.addedDate,
      isDelete: false,
      deleteIndex: -1,
      isEdit: true
    });

    item.valueChanges
      .pipe(
        debounceTime(50),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe(values => this.subscribeMedicalAlertArrayItemValueChanges(item, values));
    return item;
  }

  subscribeMedicalAlertArrayItemValueChanges(item: FormGroup, values) {
    const pInfo = this.patientInfo[0];

    if (values.isDelete) {
      pInfo.medicalAlerts.splice(values.deleteIndex, 1);
      return;
    }

    const formArray = item.parent as FormArray;
    const index = formArray.value.map(arr => JSON.stringify(arr)).indexOf(JSON.stringify(values));
    const info = pInfo.medicalAlerts[index];
    if (!info) {
      const updatedInfo = <any>{
        alertType: values.type,
        name: values.name,
        remark: values.remark,
        priority: values.priority,
        addedDate: values.addedDate,
        // expiryDate: values.expiryDate
        // addedDate: moment(values.addedDate).format(DISPLAY_DATE_FORMAT),
        expiryDate: moment(values.expiryDate).format(DISPLAY_DATE_FORMAT)
      };
      pInfo.medicalAlerts.push(updatedInfo);
    } else {
      info.alertType = values.type;
      info.name = values.name;
      info.remark = values.remark;
      info.priority = values.priority;
      info.addedDate = values.addedDate;
      // info.expiryDate = values.expiryDate;
      // info.addedDate = moment(values.addedDate).format(DISPLAY_DATE_FORMAT);
      info.expiryDate = moment(values.expiryDate).format(DISPLAY_DATE_FORMAT);
    }

    console.log('item changed: ', item);
  }

  toggleHide() {
    const elementClickedOn = document.getElementById('addMorePatientInformation');
    elementClickedOn.style.display = 'none';

    // elementClickedOn.style.visibility = "hidden";

    const element = document.getElementById('otherPatientInfo');
    element.style.display = 'block';
    element.style.visibility = 'visible';
  }

  markRequiredAndTouched(formControl: AbstractControl) {
    formControl.setValidators(Validators.required);
    formControl.markAsTouched();
    formControl.updateValueAndValidity();
  }

  clearRequiredAndTouched(formControl: AbstractControl) {
    formControl.clearValidators();
    formControl.markAsTouched();
    formControl.updateValueAndValidity();
  }
}
