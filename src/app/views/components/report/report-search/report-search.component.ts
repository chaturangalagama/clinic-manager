import { NgxPermissionsService } from 'ngx-permissions';
import { PermissionsGuardService } from './../../../../services/permissions-guard.service';
import { AppConfigService } from './../../../../services/app-config.service';
import { ApiCmsManagementService } from './../../../../services/api-cms-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from './../../../../services/alert.service';
import { ApiPatientInfoService } from './../../../../services/api-patient-info.service';
import { filter, distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ReportCategorization } from './../../../../model/ReportCategorization';
import { ReportCategories, ReportCategory, Report } from './../../../../objects/ReportCatregories';
import { StoreService } from './../../../../services/store.service';
import { Component, OnInit } from '@angular/core';
import { LoggerService } from '../../../../services/logger.service';
import * as moment from 'moment';

@Component({
  selector: 'app-report-search',
  templateUrl: './report-search.component.html',
  styleUrls: ['./report-search.component.scss']
})
export class ReportSearchComponent implements OnInit {
  objectKeys = Object.keys;
  // reportUrl = 'http://10.10.20.5:8080/reporting-ui/';
  reportUrl: string;

  // Form Submission
  authToken: string;
  payload: any;
  reportSubmitAction: string;
  // End of Form Submission

  reportCategories: ReportCategories;
  selectedCategory: ReportCategory;
  selectedReport: Report;

  // Input Filter
  patientTypeahead = new Subject<string>();
  patients: any;

  // doctorTypeahead = new Subject<string>();
  doctors: any;

  drugTypeahead = new Subject<string>();
  drugs: any;

  clinics: any;

  medicalCoverages: any;

  endMinDate: Date;
  // End of Input Filter

  coverageTypes = [
    { value: 'CORPORATE', label: 'CORPORATE' },
    { value: 'INSURANCE', label: 'INSURANCE' },
    { value: 'MEDISAVE', label: 'MEDISAVE' },
    { value: 'CHAS', label: 'CHAS' }
  ];
  paymentStatus = [
    { value: 'PENDING_PAYMENT_CONFIRMATION', label: 'PENDING_PAYMENT_CONFIRMATION' },
    { value: 'PAID', label: 'PAID' }
  ];

  mainFormGroup: FormGroup;

  constructor(
    private store: StoreService,
    private logger: LoggerService,
    private apiPatientInfoService: ApiPatientInfoService,
    private apiCmsManagementService: ApiCmsManagementService,
    private alertService: AlertService,
    private fb: FormBuilder,
    private appConfig: AppConfigService,
    private permissionsService: NgxPermissionsService
  ) {
    this.reportUrl = appConfig.getConfig().REPORT_URL;
    this.reportCategories = <ReportCategories>ReportCategorization;
    this.selectedCategory = new ReportCategory();
    this.selectedReport = new Report();

    this.onPatientInputChanged();
    this.onDrugInputChanged();
    this.generateForm();

    this.authToken = `Bearer ${localStorage.getItem('access_token')}`;
    //this.payload = JSON.stringify({ clinicIds: '', startDate: '2018-06-01', endDate: '2018-06-30' });
    this.payload = '';
    this.reportSubmitAction = '';

    this.endMinDate = new Date();
  }

  ngOnInit() {
    // this.clinics = this.groupBy(this.store.getClinicList(), 'groupName');
    this.clinics = this.store.getClinicList();
    console.log('Clinics', this.clinics);
    this.logger.info('Clinics', this.clinics);
    this.logger.info('Reports', this.reportCategories);

    this.doctors = this.store.doctorList;
    this.medicalCoverages = this.store.medicalCoverageList;

    this.subscribeChange();
  }

  groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
      const key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  }

  onCategoryClick(data: ReportCategory) {
    console.log('Category Clicked', data);
    this.selectedCategory = data;
    this.selectedReport = new Report();

    this.resetMainGroupForm();
  }

  onReportClick(report: Report) {
    this.selectedReport = report;

    this.reportSubmitAction = this.reportUrl + report.reportName;

    this.resetMainGroupForm();

    this.setMandatoryFields(report);

    this.prePopulateData();

    this.mainFormGroup.markAsTouched();
  }

  resetMainGroupForm() {
    // Manual reset Validators, somehow clearValidators doesn't reset them
    this.mainFormGroup.get('status').setValidators(null);
    this.mainFormGroup.get('coverageType').setValidators(null);
    this.mainFormGroup.get('clinicId').setValidators(null);
    this.mainFormGroup.get('clinicIds').setValidators(null);
    this.mainFormGroup.get('doctorIds').setValidators(null);
    this.mainFormGroup.get('drugCode').setValidators(null);
    this.mainFormGroup.get('startDate').setValidators(null);
    this.mainFormGroup.get('endDate').setValidators(null);
    this.mainFormGroup.get('itemCodes').setValidators(null);
    this.mainFormGroup.get('itemCategoryCodes').setValidators(null);
    this.mainFormGroup.get('financialPlanId').setValidators(null);
    this.mainFormGroup.get('patientId').setValidators(null);
    this.mainFormGroup.get('monthlyReport').setValidators(null);
    this.mainFormGroup.updateValueAndValidity();
    // Reset Form
    this.mainFormGroup.reset();
    // Reset Validation
    this.mainFormGroup.clearValidators();
  }

  /** Form Change Subscription */
  subscribeChange() {
    this.mainFormGroup.valueChanges.subscribe(value => {
      console.log('Form Change', value);
      console.log('Form State', this.mainFormGroup.controls);
      console.log('isFormValid', this.mainFormGroup.valid);

      // set Min End Date
      if (value.startDate) {
        this.endMinDate = value.startDate;
      }
      const data = {};
      this.selectedReport.params.forEach(param => {
        if (param === 'startDate' || param === 'endDate') {
          data[param] = moment(value[param]).format('YYYY-MM-DD');
        } else if (
          value[param] &&
          (param === 'clinicIds' ||
            param === 'doctorIds' ||
            param === 'financialPlanId' ||
            param === 'coverageType' ||
            param === 'status')
        ) {
          // data[param] = value[param].map((innerValue, index) => {
          //   return `"${innerValue}"`;
          // });
          data[param] = value[param].toString();
        } else {
          data[param] = value[param];
        }
      });
      this.payload = JSON.stringify(data);
      console.log('Form Payload', this.payload);
    });
  }
  /** End of Form Change Subscription */

  /** Input Filters **/
  onPatientInputChanged() {
    try {
      this.patientTypeahead
        .pipe(
          filter(input => {
            if (input.match(/[^a-zA-Z0-9 ]/g)) {
              const str = input.replace(/[^a-zA-Z0-9 ]/g, '');
              if (str.length < 1) {
                input = str;
                return false;
              }
            }
            if (input.trim().length === 0) {
              return false;
            } else {
              return true;
            }
          }),
          distinctUntilChanged((a, b) => {
            this.logger.info('input is 1');
            return a === b;
          }),
          debounceTime(200),
          switchMap((term: string) => {
            return this.apiPatientInfoService.search(term);
          })
        )
        .subscribe(
          data => {
            if (data) {
              this.patients = data.payload;
            }
          },
          err => {
            this.alertService.error(JSON.stringify(err));
            this.onPatientInputChanged();
          }
        );
    } catch (err) {
      console.log('Search Patient Error', err);
    }
  }

  onDrugInputChanged() {
    try {
      this.drugTypeahead
        .pipe(
          filter(input => {
            if (input.match(/[^a-zA-Z0-9 ]/g)) {
              const str = input.replace(/[^a-zA-Z0-9 ]/g, '');
              if (str.length < 1) {
                input = str;
                return false;
              }
            }
            if (input.trim().length === 0) {
              return false;
            } else {
              return true;
            }
          }),
          distinctUntilChanged((a, b) => {
            this.logger.info('input is 1');
            return a === b;
          }),
          debounceTime(200),
          switchMap((term: string) => {
            return this.apiCmsManagementService.searchDrugs(term);
          })
        )
        .subscribe(
          data => {
            if (data) {
              this.drugs = data.payload;
            }
          },
          err => {
            this.alertService.error(JSON.stringify(err));
            this.onDrugInputChanged();
          }
        );
    } catch (err) {
      console.log('Search Patient Error', err);
    }
  }

  /** End of Input Filters **/

  /** Event Listeners **/
  onPatientSelect(event) {
    if (!event) {
      // re-register the typeahead when ng-select is being cleared
      this.onPatientInputChanged();
    }
  }

  onDoctorSelect(event) {
    if (!event) {
      // re-register the typeahead when ng-select is being cleared
      //this.onPatientInputChanged();
    }
  }

  onDrugSelect(event) {
    if (!event) {
      // re-register the typeahead when ng-select is being cleared
      this.onDrugInputChanged();
    }
  }

  onClinicSelect(event) {
    if (!event) {
      // re-register the typeahead when ng-select is being cleared
      // this.onDrugInputChanged();
    }
  }

  onMedicalCoverageSelect(event) {
    if (!event) {
      // re-register the typeahead when ng-select is being cleared
      // this.onDrugInputChanged();
    }
  }
  /** End of Event Listeners **/

  /** UTILS */
  getEndDatePickerPlacement(report: Report) {
    switch (report.reportName) {
      case 'pos_collection_summary':
      case 'ioc_patient':
      case 'corporate_revenue_summary':
      case 'laboratory_service_report':
      case 'report_on_weekly_revenue_summary':
      case 'report_on_sms_utilization':
        return 'bottom';

      default:
        return 'left';
    }
  }

  setMandatoryFields(report: Report) {
    report.params.forEach(value => {
      if (
        value === 'clinicIds' ||
        value === 'doctorIds' ||
        value === 'itemCodes' ||
        value === 'itemCategoryCodes' ||
        value === 'coverageType' ||
        value === 'status'
      ) {
        return;
      }
      this.mainFormGroup.get(value).setValidators(Validators.required);
      this.mainFormGroup.get(value).markAsTouched();
    });
  }
  /** End of UTILS */

  generateForm() {
    this.mainFormGroup = this.fb.group({
      clinicIds: '',
      clinicId: '',
      doctorIds: '',
      dateRange: '',
      startDate: '',
      endDate: '',
      drugCode: '',
      itemCodes: '',
      itemCategoryCodes: '',
      financialPlanId: '',
      coverageType: '',
      status: '',
      patientId: '',
      monthlyReport: ''
    });
  }

  prePopulateData() {
    /** Doctor Ids */
    if (this.findByParam('doctorIds')) {
      // pre-populate for Doctor and CA needs to find the Doctor in the clinic
      console.log('PREPOPULATE DOCTOR');
      if (!this.permissionsService.getPermission('ROLE_ALL_DOCTOR_REPORTS')) {
        if (this.permissionsService.getPermission('ROLE_CA')) {
          this.doctors = this.store.doctorListByClinic;
        } else if (this.permissionsService.getPermission('ROLE_DOCTOR')) {
          const docs = this.store.findDoctorById(this.store.getUser().context['cms-user-id']);
          // this.doctors = docs.length === 1 ? this.doctors.push(docs) : docs;
          console.log('DOCTORS', docs);
          if (!Array.isArray(docs)) {
            this.doctors = [];
            this.doctors.push(docs);
          } else {
            this.doctors = docs;
          }
          if (this.doctors.length > 0) {
            this.mainFormGroup.get('doctorIds').patchValue([this.doctors[0].id]);
          }
        }
        /** make doctor Id as mandatory, to overcome SELECT ALL when empty */
        this.mainFormGroup.get('doctorIds').setValidators([Validators.required]);
      }
    }

    /** Clinic Ids */
    if (this.findByParam('clinicIds')) {
      // pre-populate for CA and Doctor

      if (!this.permissionsService.getPermission('ROLE_ALL_CLINIC_REPORTS')) {
        const filteredClinics = this.store.getAuthorizedClinicList();
        if (!Array.isArray(filteredClinics)) {
          this.clinics = [];
          this.clinics.push(filteredClinics);
        } else {
          this.clinics = filteredClinics;
        }
        if (this.clinics.length > 0) {
          this.mainFormGroup.get('clinicIds').patchValue([this.clinics[0].id]);
        }

        /** make clinic Id as mandatory, to overcome SELECT ALL when empty */
        this.mainFormGroup.get('clinicIds').setValidators([Validators.required]);
      }
    }

    if (this.findByParam('clinicId')) {
      this.mainFormGroup.get('clinicId').patchValue(localStorage.getItem('clinicId'));
      this.mainFormGroup.updateValueAndValidity();
    }

    if (this.findByParam('itemCodes')) {
      this.mainFormGroup.get('itemCodes').patchValue('');
    }
    if (this.findByParam('itemCategoryCodes')) {
      this.mainFormGroup.get('itemCategoryCodes').patchValue('');
    }

    /**  Start Date */
    this.mainFormGroup.get('startDate').patchValue('');

    /**  End Date */
    this.mainFormGroup.get('endDate').patchValue('');
  }

  findByParam(param) {
    if (this.selectedReport && this.selectedReport.params) {
      const result = this.selectedReport.params.find(value => {
        return value === param;
      });
      return result;
    } else {
      return false;
    }
  }
}
