import { AlertService } from './alert.service';
import { DISPLAY_DATE_FORMAT } from './../constants/app.constants';
import { ApiCmsManagementService } from './api-cms-management.service';
import { MedicalAlerts } from './../objects/request/MedicalAlerts';
import { Subject, Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { PhoneNumberUtil } from 'google-libphonenumber';
import * as moment from 'moment';
import { ApiPatientInfoService } from './api-patient-info.service';
import { MedicalCoverageResponse } from './../objects/response/MedicalCoverageResponse';
import { COUNTRIES } from '../constants/countries';
import { COMMUNICATIONS } from '../constants/communications';
import { ETHNICITIES } from '../constants/ethnicities';
import { GENDERS } from '../constants/genders';
import { LANGUAGES } from '../constants/languages';
import { MARITAL_STATUS } from '../constants/marital.status';
import { NATIONALITIES } from '../constants/nationalities';
import { OCCUPATIONS } from '../constants/occupations';
import { TITLES } from '../constants/titles';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';

@Injectable()
export class PatientService {
  patientDetailFormGroup: FormGroup;
  patientAddFormGroup: FormGroup;
  checkUserExist = false;

  private isUserIDValidated = new Subject<any>();

  constructor(
    private fb: FormBuilder,
    private apiCmsManagementService: ApiCmsManagementService
  ) {
    this.patientDetailFormGroup = this.createFormGroup('PatientDetail');
    this.patientAddFormGroup = this.createFormGroup('PatientAdd');
  }

  createFormGroup(key: string): FormGroup {
    switch (key) {
      case 'PatientDetail':
        return this.createPatientDetailFormGroup();
      case 'PatientAdd':
        return this.createPatientAddFormGroup();
      default:
        return this.createPatientDetailFormGroup();
    }
  }

  addMedicalAlertsForm(): FormArray {
    const medicalAlerts = this.fb.group({
      alerts: new MedicalAlerts()
    });

    return new FormArray([medicalAlerts]);
  }

  addMedicalCoverageForm(): FormArray {
    const medicalCoverage = this.fb.group({
      coverage: new MedicalCoverageResponse()
    });

    return new FormArray([medicalCoverage]);
  }

  createPatientAddFormGroup(): FormGroup {
    console.log('Entering createPatientAddFormGroup()');
    const formGroup = this.fb.group({
      needRefresh: true,
      headerFormGroup: this.fb.group({
        name: 'Add new patient'
      }),
      basicInfoFormGroup: this.fb.group({
        title: ['', Validators.required],
        titles: {
          value: TITLES.map(title => {
            return { value: title, label: title };
          })
        },
        name: ['', Validators.required],
        // birth: "",
        birthday: ['', Validators.required],
        gender: ['', Validators.required],
        genderOptions: {
          value: GENDERS.map(gender => {
            return { value: gender.toUpperCase(), label: gender };
          })
        },
        fullId: this.fb.group({
          id: ['', [Validators.required, Validators.minLength(4)]],
          idType: ['', Validators.required],
          selectedCountry: ''
        }),
        idTypes: {
          value: [
            { value: 'NRIC_PINK', label: 'NRIC (Pink)' },
            { value: 'NRIC_BLUE', label: 'NRIC (Blue)' },
            // { value: 'NRIC', label: 'Singaporean/PR NRIC' },
            { value: 'MIC', label: 'Malaysian IC' },
            { value: 'FIN', label: 'FIN' },
            { value: 'PASSPORT', label: 'Passport' },
            { value: 'OTHER', label: 'Other' }
          ]
        },
        address1: ['', Validators.required], // "123 Bayfront Inc",
        address2: '', // "Tower 1 #10-01",
        email: ['', this.validateEmail],
        postcode: ['', Validators.minLength(6)],
        consentGiven: true,
        contactNumber: ['', Validators.required],
        countryCode: '',
        countries: {
          value: COUNTRIES.map(country => {
            return { value: country, label: country };
          })
        },
        country: 'SINGAPORE',
        maritalStatusDropdown: {
          value: MARITAL_STATUS.map(status => {
            return { value: status.toUpperCase(), label: status };
          })
        },
        maritalStatus: ['', Validators.required],
        preferredMethodOfCommunication: ['', Validators.required],
        communicationMode: {
          value: COMMUNICATIONS.map(communication => {
            return {
              value: communication.toLowerCase(),
              label: communication
            };
          })
        }
      }),
      alertFormGroup: this.fb.group({
        alertArray: this.fb.array([]),
        state: '',
        isAdd: false,
        specialNotes: '',
        requiredSave: false
      }),
      medicalAlertFormGroup: this.fb.group({
        alertArray: this.fb.array([]),
        state: '',
        isAdd: false,
        requiredSave: false
      }),
      medicalCoverageFormGroup: this.fb.group({
        selectedPlans: '',
        testCoverage: this.addMedicalCoverageForm()
      }),
      selectedPlans: this.fb.array([]),
      attachedPlans: this.fb.array([]),
      emergencyContactFormGroup: this.fb.group({
        name: '',
        contact: '',
        relationship: '',
        relationshipDropdown: {
          value: [
            { value: 'SPOUSE', label: 'SPOUSE' },
            { value: 'CHILDREN', label: 'CHILDREN' },
            { value: 'PARENT', label: 'PARENT' },
            { value: 'IN_LAWS', label: 'IN_LAWS' }
          ]

          // RELATIONSHIPS.map(relationship => {
          //     return { value: relationship, label: relationship };
          // })
        }
      }),
      otherInfoFormGroup: this.fb.group({
        nationality: '', // "Singaporean",
        race: '', // "Chinese",
        maritalStatus: '', // "SINGLE",
        preferredLanguage: '', // "English",
        nationalitiesDropdown: {
          value: NATIONALITIES.map(nationality => {
            return { value: nationality, label: nationality };
          })
        },
        raceDropdown: {
          value: ETHNICITIES.map(ethnicity => {
            return { value: ethnicity, label: ethnicity };
          })
        },
        maritalStatusDropdown: {
          value: MARITAL_STATUS.map(status => {
            return { value: status.toUpperCase(), label: status };
          })
        },
        languagesDropdown: {
          value: LANGUAGES.map(language => {
            return { value: language, label: language };
          })
        }
      }),
      companyInfoFormGroup: this.fb.group({
        company: '',
        occupation: '',
        address1: '',
        address2: '',
        postalCode: ['', Validators.minLength(6)],
        occupationDropdown: {
          value: OCCUPATIONS.map(occupation => {
            return { value: occupation, label: occupation };
          })
        }
      })
    });

    formGroup
      .get('basicInfoFormGroup')
      .get('postcode')
      .setAsyncValidators(
        this.findAddress(
          this.apiCmsManagementService,
          formGroup.get('basicInfoFormGroup').get('postcode'),
          formGroup.get('basicInfoFormGroup').get('address1'),
          formGroup.get('companyInfoFormGroup').get('address2'),
          <FormGroup>formGroup.get('basicInfoFormGroup')
        )
      );

    formGroup
      .get('companyInfoFormGroup')
      .get('postalCode')
      .setAsyncValidators(
        this.findAddress(
          this.apiCmsManagementService,
          formGroup.get('companyInfoFormGroup').get('postalCode'),
          formGroup.get('companyInfoFormGroup').get('address1'),
          formGroup.get('companyInfoFormGroup').get('address2'),
          <FormGroup>formGroup.get('companyInfoFormGroup')
        )
      );

    return formGroup;
  }

  createPatientDetailHistoryFormGroup(): FormGroup {
    return this.fb.group({
      historyFilterFormGroup: this.fb.group({
        dateFrom: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        dateTo: new Date(),
        doctors: { value: [] },
        doctor: '',
        paymentStatus: { value: [] },
        status: ''
      }),
      historyListFormGroup: this.fb.group({
        formArray: this.fb.array([])
      }),
      historyDetailFormGroup: this.fb.group({
        patientInfo: {},
        consultationInfo: {},
        paymentInfo: {},
        gstValue: 0.07,
        overallCharges: { value: [] },
        doctorId: '',
        billNo: '',
        date: '',
        consultationStartTime: '',
        consultationEndTime: '',
        purpose: '',
        notes: '',
        diagnosisArray: this.fb.array([]),
        notesArray: this.fb.array([]),
        serviceArray: this.fb.array([]),
        drugArray: this.fb.array([]),
        filter: '',
        documentsArray: this.fb.array([]),
        newDocumentsArray: this.fb.array([]),
        testArray: this.fb.array([]),
        vaccineArray: this.fb.array([]),
        certificateArray: this.fb.array([]),
        referralArray: this.fb.array([]),
        memo: '',
        startTime: '',
        endTime: '',
        timeChitFrom: '',
        timeChitTo: '',
        printFormGroup: this.fb.group({
          receiptTypes: {
            value: [
              { value: 'general', label: 'General' },
              // { value: 'detail', label: 'Detail' },
              { value: 'breakdown', label: 'Breakdown' }
            ]
          },
          receiptType: 'general',
          printAll: false,
          disablePageBreak: false
        }),
        followupConsultationFormGroup: this.fb.group({
          id: '',
          patientId: '',
          patientVisitId: '',
          followupDate: '',
          remarks: ''
        }),
        clinicNotes: ''
      })
    });
  }

  createPatientDetailFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      needRefresh: true,
      isHistoryList: true,
      historyDetailIndex: -1,
      headerFormGroup: this.fb.group({
        name: ''
      }),
      alertFormGroup: this.fb.group({
        alertArray: this.fb.array([]),
        state: '',
        isAdd: false,
        requiredSave: false
      }),
      medicalAlertFormGroup: this.fb.group({
        alertArray: this.fb.array([]),
        trashArray: this.fb.array([]),
        state: '',
        isAdd: false,
        requiredSave: false
      }),
      basicInfoFormGroup: this.fb.group({
        titles: {
          value: TITLES.map(title => {
            return { value: title, label: title };
          })
        },
        title: ['', Validators.required],
        name: ['', Validators.required],
        birth: [new Date(), Validators.required],
        genders: {
          value: GENDERS.map(gender => {
            return { value: gender.toUpperCase(), label: gender };
          })
        },
        gender: ['', Validators.required],
        fullId: this.fb.group({
          id: ['', [Validators.required, Validators.minLength(4)]],
          idType: ['', Validators.required],
          selectedCountry: 'SINGAPORE'
        }),
        // id: ['', Validators.required],
        idTypes: {
          value: [
            { value: 'NRIC_PINK', label: 'NRIC (Pink)' },
            { value: 'NRIC_BLUE', label: 'NRIC (Blue)' },
            // { value: 'NRIC', label: 'Singaporean/PR NRIC' },
            { value: 'MIC', label: 'Malaysian IC' },
            { value: 'FIN', label: 'FIN' },
            { value: 'PASSPORT', label: 'Passport' },
            { value: 'OTHER', label: 'Other' }
          ]
        },
        line1: ['', Validators.required],
        line2: '',
        // idType: ['NRIC', Validators.required],
        countries: {
          value: COUNTRIES.map(country => {
            return { value: country, label: country };
          })
        },
        country: ['SINGAPORE', Validators.required],
        races: {
          value: ETHNICITIES.map(ethnicity => {
            return { value: ethnicity, label: ethnicity };
          })
        },
        race: '',
        nationalities: {
          value: NATIONALITIES.map(nationality => {
            return { value: nationality, label: nationality };
          })
        },
        nationality: '',
        maritalStatus: [
          {
            value: MARITAL_STATUS.map(status => {
              return {
                value: status.toUpperCase(),
                label: status
              };
            })
          },
          Validators.required
        ],
        status: ['', Validators.required],
        languages: {
          value: LANGUAGES.map(language => {
            return { value: language, label: language };
          })
        },
        language: '',
        primary: ['', [Validators.required, this.validateNumber]],
        secondary: ['', this.validateNumber],
        postCode: '',
        email: ['', this.validateEmail],
        communications: {
          value: COMMUNICATIONS.map(communication => {
            return {
              value: communication.toLowerCase(),
              label: communication
            };
          })
        },
        communicationMode: ['phone', Validators.required],
        consentGiven: true
      }),
      companyInfoFormGroup: this.fb.group({
        company: '',
        occupations: {
          value: OCCUPATIONS.map(occupation => {
            return { value: occupation, label: occupation };
          })
        },
        occupation: '',
        line1: '',
        line2: '',
        postCode: ''
      }),
      emergencyContactFormGroup: this.fb.group({
        name: '',
        contact: '',
        relationships: {
          value: [
            { value: 'SPOUSE', label: 'SPOUSE' },
            { value: 'CHILDREN', label: 'CHILDREN' },
            { value: 'PARENT', label: 'PARENT' },
            { value: 'IN_LAWS', label: 'IN LAWS' }
          ]
          // RELATIONSHIPS.map(relationship => {
          //     return { value: relationship, label: relationship };
          // })
        },
        relationship: ''
      }),
      documentsFormGroup: this.fb.group({
        filter: '',
        dateRange: '',
        documentsArray: this.fb.array([]),
        newDocumentsArray: this.fb.array([])
      }),
      selectedPlans: this.fb.array([]),
      consultationFormGroup: this.fb.group({
        search: '',
        dateFrom: new Date(),
        dateTo: new Date()
      }),
      historyFilterFormGroup: this.fb.group({
        dateFrom: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        dateTo: new Date(),
        doctors: { value: [] },
        doctor: '',
        paymentStatus: { value: [] },
        status: ''
      }),
      historyListFormGroup: this.fb.group({
        formArray: this.fb.array([])
      }),
      historyDetailFormGroup: this.fb.group({
        patientInfo: {},
        consultationInfo: {},
        paymentInfo: {},
        gstValue: 0.07,
        overallCharges: { value: [] },
        doctorId: '',
        billNo: '',
        date: '',
        consultationStartTime: '',
        consultationEndTime: '',
        purpose: '',
        notes: '',
        diagnosisArray: this.fb.array([]),
        notesArray: this.fb.array([]),
        itemArray: this.fb.array([]),
        filter: '',
        documentsArray: this.fb.array([]),
        newDocumentsArray: this.fb.array([]),
        certificateArray: this.fb.array([]),
        referralArray: this.fb.array([]),
        memo: '',
        startTime: '',
        endTime: '',
        timeChitFrom: '',
        timeChitTo: '',
        printFormGroup: this.fb.group({
          receiptTypes: {
            value: [
              { value: 'general', label: 'General' },
              // { value: 'detail', label: 'Detail' },
              { value: 'breakdown', label: 'Breakdown' }
            ]
          },
          receiptType: 'general',
          printAll: false,
          disablePageBreak: false
        }),
        followupConsultationFormGroup: this.fb.group({
          id: '',
          patientId: '',
          patientVisitId: '',
          followupDate: '',
          remarks: ''
        }),
        clinicNotes: ''
      })
    });

    return formGroup;
  }

  getPatientDetailFormGroup(): FormGroup {
    return this.patientDetailFormGroup;
  }

  setPatientDetailFormGroup(formGroup: FormGroup) {
    this.patientDetailFormGroup = formGroup;
  }

  resetPatientDetailFormGroup() {
    this.patientDetailFormGroup = this.createPatientDetailFormGroup();
  }

  getPatientAddFormGroup(): FormGroup {
    return this.patientAddFormGroup;
  }

  setPatientAddFormGroup(formGroup: FormGroup) {
    this.patientAddFormGroup = formGroup;
  }

  resetPatientAddFormGroup() {
    this.patientAddFormGroup = this.createPatientAddFormGroup();
  }

  // Methods to create form groups for individual components

  createPatientOtherPatientInfoFormGroup(): FormGroup {
    return this.fb.group({
      nationality: '', // "Singaporean",
      race: '', // "Chinese",
      maritalStatus: '', // "SINGLE",
      languageSpoken: '', // "English",
      nationalitiesDropdown: {
        value: NATIONALITIES.map(nationality => {
          return { value: nationality, label: nationality };
        })
      },
      raceDropdown: {
        value: ETHNICITIES.map(ethnicity => {
          return { value: ethnicity, label: ethnicity };
        })
      },
      maritalStatusDropdown: {
        value: MARITAL_STATUS.map(status => {
          return { value: status.toUpperCase(), label: status };
        })
      },
      languagesDropdown: {
        value: LANGUAGES.map(language => {
          return { value: language, label: language };
        })
      }
    });
  }

  createPatientBasicInfoFormGroup(): FormGroup {
    return this.fb.group({
      titles: {
        value: TITLES.map(title => {
          return { value: title, label: title };
        })
      },
      title: ['', Validators.required],
      name: ['', Validators.required],
      birth: [new Date(), Validators.required],
      genders: {
        value: GENDERS.map(gender => {
          return { value: gender.toUpperCase(), label: gender };
        })
      },
      gender: ['', Validators.required],
      fullId: this.fb.group({
        id: ['', [Validators.required, Validators.minLength(4)]],
        idType: ['', Validators.required],
        selectedCountry: 'SINGAPORE'
      }),
      idTypes: {
        value: [
          { value: 'NRIC_PINK', label: 'NRIC (Pink)' },
          { value: 'NRIC_BLUE', label: 'NRIC (Blue)' },
          { value: 'MIC', label: 'Malaysian IC' },
          { value: 'FIN', label: 'FIN' },
          { value: 'PASSPORT', label: 'Passport' },
          { value: 'OTHER', label: 'Other' }
        ]
      },
      countries: {
        value: COUNTRIES.map(country => {
          return { value: country, label: country };
        })
      },
      country: ['SINGAPORE', Validators.required],
      races: {
        value: ETHNICITIES.map(ethnicity => {
          return { value: ethnicity, label: ethnicity };
        })
      },
      race: '',
      nationalities: {
        value: NATIONALITIES.map(nationality => {
          return { value: nationality, label: nationality };
        })
      },
      nationality: '',
      maritalStatus: [
        {
          value: MARITAL_STATUS.map(status => {
            return {
              value: status.toUpperCase(),
              label: status
            };
          })
        },
        Validators.required
      ],
      status: ['', Validators.required],
      languages: {
        value: LANGUAGES.map(language => {
          return { value: language, label: language };
        })
      },
      language: '',
      primary: ['', [Validators.required, this.validateNumber]],
      // primary: ['', Validators.required],
      secondary: ['', this.validateNumber],
      line1: ['', Validators.required],
      line2: '',
      postCode: '',
      email: ['', this.validateEmail],
      communications: {
        value: COMMUNICATIONS.map(communication => {
          return {
            value: communication.toLowerCase(),
            label: communication
          };
        })
      },
      communicationMode: ['phone', Validators.required],
      consentGiven: true
    });
  }

  createPatientCompanyInfoFormGroup(): FormGroup {
    return this.fb.group({
      company: '',
      occupations: {
        value: OCCUPATIONS.map(occupation => {
          return { value: occupation, label: occupation };
        })
      },
      occupation: '',
      line1: '',
      line2: '',
      postCode: ''
    });
  }

  createPatientEmergencyContactFormGroup(): FormGroup {
    return this.fb.group({
      name: '',
      contact: '',
      relationships: {
        value: [
          { value: 'SPOUSE', label: 'SPOUSE' },
          { value: 'CHILDREN', label: 'CHILDREN' },
          { value: 'PARENT', label: 'PARENT' },
          { value: 'IN_LAWS', label: 'IN LAWS' }
        ]
      },
      relationship: ''
    });
  }

  // Check Methods

  checkBasicDetailInfo(patientInfo, formGroup: FormGroup) {
    // Basic Contact Info
    patientInfo.title = formGroup.get('title').value;
    patientInfo.preferredMethodOfCommunication = formGroup.get('communicationMode').value;
    patientInfo.consentGiven = formGroup.get('consentGiven').value;
    patientInfo.race = formGroup.get('race').value;
    patientInfo.preferredLanguage = formGroup.get('language').value;
    patientInfo.name = formGroup.get('name').value;
    patientInfo.dob = moment(formGroup.get('birth').value).format(DISPLAY_DATE_FORMAT);
    patientInfo.userId.number = formGroup.get('fullId').get('id').value;
    patientInfo.userId.idType = formGroup.get('fullId').get('idType').value;
    patientInfo.gender = formGroup.get('gender').value;
    patientInfo.contactNumber.number = formGroup.get('primary').value;
    patientInfo.status = 'ACTIVE';
    patientInfo.address.country = formGroup.get('country').value;
    patientInfo.address.address =
      formGroup.get('line1').value +
      (formGroup.get('line1').value.endsWith('\n') ? '' : '\n') +
      formGroup.get('line2').value;
    patientInfo.emailAddress = formGroup.get('email').value;
    patientInfo.nationality = formGroup.get('nationality').value;
    patientInfo.maritalStatus = formGroup.get('status').value;
    patientInfo.address.postalCode = formGroup.get('postCode').value;
    let tempSec: string = formGroup.get('secondary').value;
    tempSec = tempSec.trim();

    if (tempSec) {
      if (patientInfo.secondaryNumber) {
        patientInfo.secondaryNumber.number = formGroup.get('secondary').value;
      } else {
        const secondaryNumber = { number: formGroup.get('secondary').value };
        patientInfo['secondaryNumber'] = secondaryNumber;
      }
    } else {
      patientInfo.secondaryNumber = {
        number: ''
      };
    }

    return patientInfo;
  }

  checkEmergencyContactInfo(patientInfo, formGroup: FormGroup) {
    if (formGroup.get('relationship').value) {
        patientInfo.emergencyContactNumber = {};
        patientInfo.emergencyContactNumber.name = formGroup.get('name').value;
        patientInfo.emergencyContactNumber.number = formGroup.get('contact').value;
        patientInfo.emergencyContactNumber.relationship = formGroup.get('relationship').value;
    }

    return patientInfo;
  }

  checkCompanyInfo(patientInfo, formGroup: FormGroup) {
    patientInfo.company.name = formGroup.get('company').value;
    patientInfo.company.occupation = formGroup.get('occupation').value;
    patientInfo.company.postalCode = formGroup.get('postCode').value;
    patientInfo.company.address =
      formGroup.get('line1').value +
      (formGroup.get('line1').value.endsWith('\n') ? '' : '\n') +
      formGroup.get('line2').value;

    return patientInfo;
  }

  // Validation/Helper functions for FormGroups:
  // Includes
  // 1) Validating user existence in system
  // 2) Validation of NRIC
  // 3) Populate address based on valid zipcode entered into input
  // 4) Validating email address
  checkUserInSystem(apiPatientInfoService: ApiPatientInfoService, idType, idValue) {
    const promise = new Promise(function(resolve, reject) {
      apiPatientInfoService.validateID(idType + ':' + idValue).subscribe(res => {
        if (res.payload) resolve('ID is valid');
        else reject('ID is not valid');
      });
    });

    return promise;
  }

  checkIDisValid() {
    const promise = new Promise(function(resolve, reject) {
      this.apiCmsManagementService.validateIdentification('NRIC', 'S8835803A').subscribe(res => {
        if (res.payload) resolve('ID is valid');
        else reject('ID is not valid');
      });
    });
    return promise;
  }

  validateIdentification(
    apiCmsManagementService: ApiCmsManagementService,
    currentControl: AbstractControl,
    controlType
  ): AsyncValidatorFn {
    //    this.isUserIDValidated = null;
    return (control: AbstractControl) => {
      let idType = '';
      let idValue = '';

      if (controlType === 'idType') {
        idType = currentControl.value;
        idValue = control.value;
      } else if (controlType === 'id') {
        idType = control.value;
        idValue = currentControl.value;
      }

      idType = idType === 'NRIC_PINK' || idType === 'NRIC_BLUE' ? 'NRIC' : idType;

      if (idValue && (idType === 'NRIC' || idType === 'FIN')) {
        // control.markAsTouched();

        return timer(500).pipe(
          switchMap(() => {
            return apiCmsManagementService.validateIdentification(idType, idValue).pipe(
              map(res => {
                if (res.payload) {
                  this.isUserIDValidated = null;
                } else {
                  this.isUserIDValidated = { userIdIsNotValid: { value: idValue } } as any;
                  return this.isUserIDValidated;
                }
              }),
              catchError(this.handleError)
            );
          })
        );
      } else {
        return of(null);
      }
    };
  }

  checkWhetherUserExists(
    apiPatientInfoService: ApiPatientInfoService,
    currentControl: AbstractControl,
    controlType
  ): AsyncValidatorFn {
    return (control: AbstractControl) => {
      let idType = '';
      let idValue = '';

      if (controlType === 'idType') {
        idType = currentControl.value;
        idValue = control.value;
      } else if (controlType === 'id') {
        idType = control.value;
        idValue = currentControl.value;
      }

      if (idValue.length > 0) {
        control.markAsTouched();
        return apiPatientInfoService.validateID(idType + ':' + idValue).pipe(
          map(
            res => {
              if (res.payload) {
                // USER EXISTS
                return { userid: { value: idValue } };
              } else {
                return null;
              }
            },
            err => this.handleError
          ),
          catchError(this.handleError)
        );
      } else {
        return of(null);
      }
    };
  }

  findAddress(
    apiCmsManagementService: ApiCmsManagementService,
    postCode: AbstractControl,
    address1Input: AbstractControl,
    address2Input: AbstractControl,
    formGroup: FormGroup
  ): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const debounceTime = 500; // milliseconds
      return timer(debounceTime).pipe(
        switchMap(() => {
          if (control.value) {
            return apiCmsManagementService.listAddress(control.value + '').pipe(
              map(
                res => {
                  if (res.payload) {
                    console.log('res.paylod: ', res.payload);
                    let addr: string = res.payload.address;
                    addr = addr.split(control.value).join(' ');

                    address1Input.patchValue(addr);
                    address2Input.patchValue('');
                    formGroup.patchValue({ addressInput: addr });
                    return null;
                  } else {
                    return null;
                    // return { zipcode: { value: res } };
                  }
                },
                err => {
                  console.log('ERROR', err);
                }
              ),
              catchError(this.handleError)
            );
          } else {
            return of(null);
          }
        })
      );
    };
  }

  private handleError(error: any) {
    console.log('HANDLING ERRO');
    const errMsg = error.message
      ? error.message
      : error.status
      ? `${error.status} - ${error.statusText}`
      : 'Server error';
    return of(null);
  }

  validateEmail(control: FormGroup) {
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{1,}$/;
    const email = control.value;

    if ((email && (EMAIL_PATTERN.test(email) || email.length === 0)) || email === undefined || email === '') {
      return null;
    } else {
      return { vaildEmail: { value: email, message: 'Email address is invalid' } };
    }
  }

  validateNumber(control: FormGroup) {
    const number = control.value;
    if (number === '') {
      return null;
    }

    const phoneUtil = PhoneNumberUtil.getInstance();

    try {
      const NUMBER_PATTERN = /^\+?[1-9][\s\d]{1,14}$/;
      const result = phoneUtil.parseAndKeepRawInput(number, 'SG');
      if (phoneUtil.isPossibleNumber(result) && NUMBER_PATTERN.test(number)) {
        console.log('phone:', phoneUtil);
        return null;
      }
      // console.log(result.getCountryCode());
      // console.log(phoneUtil.getRegionCodeForNumber(result));
      // console.log(result.getRawInput());
      // console.log(phoneUtil.isPossibleNumber(result)); // loose one
      // console.log(phoneUtil.isValidNumber(result)); // strict one
      // console.log(phoneUtil.format(result, PhoneNumberFormat.E164));
      return { validNumber: { value: number, message: 'Number is invalid' } };
    } catch {
      return { validNumber: { value: number, message: 'Number is invalid' } };
    }
  }

  getIsUserIDValidated(): Observable<any> {
    return this.isUserIDValidated;
  }

  resetIsUserIDValidated() {
    this.isUserIDValidated = {} as any;
  }
}
