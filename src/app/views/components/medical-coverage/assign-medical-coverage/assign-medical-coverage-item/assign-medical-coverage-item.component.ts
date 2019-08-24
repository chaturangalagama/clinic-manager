import { ApiCmsManagementService } from './../../../../../services/api-cms-management.service';
import { DISPLAY_DATE_FORMAT } from './../../../../../constants/app.constants';
import { AlertService } from './../../../../../services/alert.service';
import { ApiPatientInfoService } from './../../../../../services/api-patient-info.service';
import { MedicalCoverageSelected, CoverageSelected } from './../../../../../objects/MedicalCoverage';
import { StoreService } from '../../../../../services/store.service';

import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Subject } from 'rxjs';
import { filter, distinctUntilChanged, tap, debounceTime, switchMap } from 'rxjs/operators';

import * as moment from 'moment';

@Component({
  selector: 'app-assign-medical-coverage-item',
  templateUrl: './assign-medical-coverage-item.component.html',
  styleUrls: ['./assign-medical-coverage-item.component.scss']
})
export class AssignMedicalCoverageItemComponent implements OnInit {
  // new ng-select
  medicalCoverageSelect = new Array<MedicalCoverageSelected>();
  planSelect = [];
  medicalCoverages: Array<MedicalCoverageSelected>;

  selectedMedicalCoverages = new Map();

  @Input() medicalCoverage: FormGroup;
  @Input() index: number;
  @Output() deleteClicked = new EventEmitter<number>();

  selectedCoverage: MedicalCoverageSelected;
  selectedPlan: CoverageSelected;

  showExtra: boolean;
  planSelected: boolean;
  employeeNo: any;
  contacts;

  minDate: Date;

  codesTypeahead = new Subject<string>();
  loading = false;

  constructor(
    private store: StoreService,
    private fb: FormBuilder,
    private apiPatientInfoService: ApiPatientInfoService,
    private alertService: AlertService,
    private apiCmsManagementService: ApiCmsManagementService
  ) { }
  ngOnInit() {
    if (this.medicalCoverage.value.isNew) {
      this.minDate = new Date();
      // this.medicalCoverages = [...this.store.getMedicalCoverages()];
      const filteredMedicalCoverages = this.store.getMedicalCoverages().filter(element => {
        return element['status'] === 'ACTIVE' && element['coveragePlans'].length > 0;
      });
      this.medicalCoverages = filteredMedicalCoverages;
      console.log('AVAIL PLANS', this.medicalCoverages);
      console.log('AVAIL PLANS1', this.store.getMedicalCoverages());

      this.populateMedicalCoverage();
      this.subscribeChanges();
      this.subscribeMedicalCoverageValueChanges();

      this.onFilterInputChanged();
    }

    console.log("MEDICAL COVERAGE:  ", this.medicalCoverage);
  }

  subscribeChanges() {
    if (
      this.medicalCoverage &&
      this.medicalCoverage.get('medicalCoverageId').value &&
      this.medicalCoverage.get('planId').value
    ) {
      // Get Plans from medical coverage
      const plans = this.store.getPlansByCoverageId(this.medicalCoverage.get('medicalCoverageId').value);
      console.log('PLANS', plans);
      // this.hasContact();
      // When Plan is not inside STORE
      if (plans.length < 1) {
        this.medicalCoverages.push(this.medicalCoverage.value.coverageSelected);
        this.medicalCoverageSelect = this.medicalCoverages;
      }

      this.populatePlan(this.medicalCoverage.value.coverageSelected);

      if (this.index === 0) {
        this.showExtra = true;
      }
    }
  }

  hasContact() {

    const contact = this.medicalCoverage.get('contacts') ? this.medicalCoverage.get('contacts') :
      this.medicalCoverage.get('coverageSelected').value.contacts;

    if (contact && contact.length > 0) {
      return true;
    } else {
      return false;
    }

  }

  populateMedicalCoverage() {
    //new ng-select
    console.log('SELECT POPULATE', this.medicalCoverages);
    this.medicalCoverageSelect = this.medicalCoverages;
  }

  populatePlan(data) {
    const coverageSelected = data;
    console.log('PLAN DATA __', data);
    //new ng-select
    this.planSelect = coverageSelected.coveragePlans;
  }

  onCoverageSelected(event) {
    console.log('Selected Coverage', event);
    this.selectedCoverage = event;

    this.selectedMedicalCoverages.set(event.id, event);

    console.log('MEDICAL COVERAGE SET', this.selectedMedicalCoverages);
    this.populatePlan(event);
    this.medicalCoverage.get('startDate').patchValue(new Date());
    // this.medicalCoverage.get('startDate').patchValue(new Date());
    this.medicalCoverage.get('endDate').patchValue('');
    this.medicalCoverage.get('coverageType').patchValue(event.type);
    this.medicalCoverage.get('coverageSelected').patchValue(this.selectedCoverage);
    this.medicalCoverage.get('planId').patchValue('');
    this.medicalCoverage.get('remarks').patchValue('');
    this.medicalCoverage.get('costCenter').patchValue('');
  }

  onPlanSelected(event) {
    console.log('PLAN EVENT', event);
    this.selectedPlan = event;
    this.planSelected = true;
    this.showExtra = false;
    this.medicalCoverage.get('planSelected').patchValue(event);
  }

  onShowExtraClicked() {
    this.showExtra = !this.showExtra;
  }

  onbtnDeleteClicked() {
    this.deleteClicked.emit(this.index);

    if (!this.medicalCoverage.get('isNew')) {
      this.apiPatientInfoService
        .removePolicy(
          this.medicalCoverage.get('id').value,
          this.medicalCoverage.get('coverageType').value,
          this.medicalCoverage.get('medicalCoverageId').value,
          this.medicalCoverage.get('planId').value
        )
        .subscribe(
          resp => {
            console.log('success');
          },
          err => {
            this.alertService.error('Error from medical coverage removal', err);
          }
        );
    }
  }

  subscribeMedicalCoverageValueChanges() {
    this.medicalCoverage.valueChanges
      .pipe(debounceTime(50), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(values => {
        console.log('values of med cov:', values);

        values.startDate = values.startDate && moment(values.startDate, DISPLAY_DATE_FORMAT).format(DISPLAY_DATE_FORMAT);
        values.endDate = values.endDate && moment(values.endDate, DISPLAY_DATE_FORMAT).format(DISPLAY_DATE_FORMAT);

        this.medicalCoverage.get('startDate').patchValue(values.startDate);
        this.medicalCoverage.get('endDate').patchValue(values.endDate);
        this.medicalCoverage.get('planSelected').value.registrationRemarks = values.planSelected.registrationRemarks;

        console.log("this patientCoverageItem: ", this.medicalCoverage);
        // this.patientCoverageItem.updateValueAndValidity();
      });
  }

  onEmployeeIdChanged() { }

  onFilterInputChanged() {
    try {
      this.codesTypeahead
        .pipe(
          filter(input => {
            if (input.trim().length === 0) {
              this.medicalCoverageSelect = this.store.getMedicalCoverages();
              this.medicalCoverages = this.store.getMedicalCoverages();
              return false;
            } else {
              return true;
            }
          }),
          distinctUntilChanged((a, b) => {
            return a === b;
          }),
          tap(() => (this.loading = true)),
          debounceTime(200),
          switchMap((term: string) => {
            return this.apiCmsManagementService.searchCoverage(term);
          })
        )
        .subscribe(
          data => {
            this.loading = false;
            console.log('DATA', data);

            if (data) {
              const filteredMedicalCoverages = data.payload.filter(element => {
                return element['status'] === 'ACTIVE' && element['coveragePlans'].length > 0;
              });

              this.medicalCoverages = filteredMedicalCoverages;
              this.medicalCoverageSelect = filteredMedicalCoverages;
            }
          },
          err => {
            this.loading = false;
            this.alertService.error(JSON.stringify(err.error.message));
          }
        );
    } catch (err) {
      console.log('Search Coverage Error', err);
    }
  }

  isShowExtra() {
    return this.showExtra;
  }


  getSubHeaderClass() {
    // console.log('this.showExtra:', this.showExtra);
    if (this.showExtra) {
      return 'row modal-sub-header modal-input1 pt-2';
    } else {
      return 'row modal-sub-header-expanded modal-input1 pt-2';
    }
  }

  // On the fly search

}



  // getPlansByCoverageId(medicalCovergaId: string) {
  //     return this.medicalCoverages.filter(elem => elem.id === medicalCovergaId);
  // }

  // getPlanFromCoveragesByPlanId(plans, planId: string) {
  //     return plans.filter(elem => elem.id === planId);
  // }
