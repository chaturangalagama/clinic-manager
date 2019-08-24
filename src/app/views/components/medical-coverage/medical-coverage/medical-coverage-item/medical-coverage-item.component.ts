import { UtilsService } from './../../../../../services/utils.service';
import { StoreService } from './../../../../../services/store.service';
import { AlertService } from './../../../../../services/alert.service';
import { ApiPatientInfoService } from './../../../../../services/api-patient-info.service';
import { FormGroup, FormArray, FormBuilder, AbstractControl, Validators, ValidatorFn } from '@angular/forms';
import { MedicalCoverageSelected, CoverageSelected } from './../../../../../objects/MedicalCoverage';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AttachedMedicalCoverage } from '../../../../../objects/AttachedMedicalCoverage';
import { Subject } from 'rxjs';
import { filter, distinctUntilChanged, tap, debounceTime, switchMap } from 'rxjs/operators';
import { ApiCmsManagementService } from '../../../../../services/api-cms-management.service';
import { DISPLAY_DATE_FORMAT } from './../../../../../constants/app.constants';

import * as moment from 'moment';

@Component({
  selector: 'app-medical-coverage-item',
  templateUrl: './medical-coverage-item.component.html',
  styleUrls: ['./medical-coverage-item.component.scss']
})
export class MedicalCoverageItemComponent implements OnInit {
  @Input() patientCoverageItem: FormGroup;
  @Input() attachedMedicalCoverages: FormArray;
  @Input() policyHolderInfo;

  @Input() hasUpdatePriority: boolean;
  @Input() hasDelete: boolean;
  @Input() hasAdd: boolean;
  @Input() displaySelectedCoverages: boolean;

  @Input() selectedIndex: number;
  @Input() index: number;
  @Input() isCompatible: boolean;
  @Input() policyHolderExpired: boolean;
  @Input() policyExpired: boolean;
  @Output() onDelete = new EventEmitter<number>();

  planSelected: boolean;
  isCollapsed: boolean;

  initialEndDate;

  // Variables for Adding New MCs
  medicalCoverageSelect = new Array<MedicalCoverageSelected>();
  planSelect = [];
  medicalCoverages: Array<MedicalCoverageSelected>;
  selectedMedicalCoverages = new Map();

  selectedCoverage: MedicalCoverageSelected;
  selectedPlan: CoverageSelected;

  minDate: Date;

  codesTypeahead = new Subject<string>();
  loading = false;

  constructor(
    private apiPatientInfoService: ApiPatientInfoService,
    private apiCmsManagementService: ApiCmsManagementService,
    private alertService: AlertService,
    private fb: FormBuilder,
    private store: StoreService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    console.log('POLICYHOLDER: ', this.policyHolderInfo);
    console.log('patientCoverageItem: ', this.patientCoverageItem);

    this.initialiseValues();

    this.subscribeMedicalCoverageValueChanges();

    if (this.patientCoverageItem.get('isNew').value) {
      this.populateMedicalCoverage();

      this.populateInputFields();

      this.onFilterInputChanged();
    }
  }
  //------------------- hasAdd methods: Adding New Coverages  --------------------//

  initialiseValues() {
    this.isCollapsed = true;
    this.minDate = new Date();

    this.initialEndDate = <string>this.patientCoverageItem.get('endDate').value;

    const policyEndDate = this.patientCoverageItem.get('coverageSelected').value.endDate;
    const today = moment().format(DISPLAY_DATE_FORMAT);
    const isPolicyExpired = !moment(today, DISPLAY_DATE_FORMAT).isSameOrBefore(
      moment(policyEndDate, DISPLAY_DATE_FORMAT)
    );

    if (!this.patientCoverageItem.get('isNew').value) {
      this.patientCoverageItem.get('endDate').markAsTouched();
      this.patientCoverageItem.updateValueAndValidity();

      const holderEndDate = this.policyHolderInfo.endDate;
      const isHolderExpired = !moment(today, DISPLAY_DATE_FORMAT).isSameOrBefore(
        moment(holderEndDate, DISPLAY_DATE_FORMAT)
      );
      this.policyHolderExpired = isHolderExpired;
    }

    if (this.hasUpdatePriority) {
      this.isPlanSelected();
    }
  }

  onbtnDeleteClicked() {
    this.isCollapsed = !this.isCollapsed;
    this.onDelete.emit(this.index);
  }

  populateInputFields() {
    if (
      this.patientCoverageItem &&
      this.patientCoverageItem.get('medicalCoverageId').value &&
      this.patientCoverageItem.get('planId').value
    ) {
      // Get Plans from medical coverage
      const plans = this.store.getPlansByCoverageId(this.patientCoverageItem.get('medicalCoverageId').value);
      console.log('PLANS', plans);
      // When Plan is not inside STORE
      if (plans.length < 1) {
        this.medicalCoverages.push(this.patientCoverageItem.get('coverageSelected').value);
        this.medicalCoverageSelect = this.medicalCoverages;
      }
      this.populatePlan(this.patientCoverageItem.get('coverageSelected').value);
    }
  }

  expiredDate(control: FormGroup) {
    const today = moment().format(DISPLAY_DATE_FORMAT);
    const date = control.value;

    const isPolicyExpired = !moment(today, DISPLAY_DATE_FORMAT).isSameOrBefore(moment(date, DISPLAY_DATE_FORMAT));

    if (!isPolicyExpired) {
      return null;
    } else {
      return { dateExpired: { value: date, message: 'End date must not be beyond the medical coverage end date.' } };
    }
  }

  subscribeMedicalCoverageValueChanges() {
    const today = moment().format(DISPLAY_DATE_FORMAT);
    const endDate = this.patientCoverageItem.get('endDate');

    this.patientCoverageItem
      .get('endDate')
      .setValidators([
        notBeforeToday(today, endDate),
        validateAgainstMC(this.patientCoverageItem.get('coverageSelected'), endDate),
        Validators.required
      ]);

    this.patientCoverageItem.valueChanges
      .pipe(
        debounceTime(50),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe(values => {
        console.log('values of med cov:', values);

        const today = moment().format(DISPLAY_DATE_FORMAT);
        const policyEndDate = this.patientCoverageItem.get('coverageSelected').value.endDate;
        const startDate = values.startDate && moment(values.startDate, DISPLAY_DATE_FORMAT).format(DISPLAY_DATE_FORMAT);
        const endDate = values.endDate && moment(values.endDate, DISPLAY_DATE_FORMAT).format(DISPLAY_DATE_FORMAT);
        const isOfDisplayFormat = moment(endDate, DISPLAY_DATE_FORMAT, true).isValid();
        const isValid = moment(startDate, DISPLAY_DATE_FORMAT).isSameOrBefore(moment(endDate, DISPLAY_DATE_FORMAT));
        const validHolderEndDate = moment(endDate, DISPLAY_DATE_FORMAT).isSameOrBefore(
          moment(policyEndDate, DISPLAY_DATE_FORMAT)
        );

        this.patientCoverageItem.get('startDate').patchValue(startDate);
        this.patientCoverageItem.get('endDate').patchValue(endDate);
        this.patientCoverageItem.get('planSelected').value.registrationRemarks =
          values.planSelected.registrationRemarks;

        console.log('this patientCoverageItem: ', this.patientCoverageItem);
      });
  }

  reset() {
    console.log('reset');

    // this.patientCoverageItem.get('coverageSelected').patchValue(null);
  }

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
                console.log('element: ', element);
                const today = moment().format(DISPLAY_DATE_FORMAT);

                return (
                  element['status'] === 'ACTIVE' &&
                  element['coveragePlans'].length > 0 &&
                  moment(today, DISPLAY_DATE_FORMAT).isSameOrBefore(moment(element['endDate'], DISPLAY_DATE_FORMAT))
                );
              });

              this.medicalCoverages = filteredMedicalCoverages;
              this.medicalCoverageSelect = filteredMedicalCoverages;
            }
          },
          err => {
            try {
              this.loading = false;
              // this.alertService.error(JSON.stringify(err.error.message));
            } catch (err) {
              this.alertService.error(JSON.stringify(err.error.message));
            }
          }
        );
    } catch (err) {
      console.log('Search Coverage Error', err);
    }
  }

  onCoverageSelected(event) {
    if (event) {
      this.selectedCoverage = event;

      this.selectedMedicalCoverages.set(event.id, event);

      this.populatePlan(event);

      this.patientCoverageItem.get('startDate').patchValue(new Date());
      this.patientCoverageItem.get('endDate').patchValue('');
      this.patientCoverageItem.get('coverageType').patchValue(event.type);
      this.patientCoverageItem.get('coverageSelected').patchValue(this.selectedCoverage);
      this.patientCoverageItem.get('planId').patchValue('');
      this.patientCoverageItem.get('remarks').patchValue('');
      this.patientCoverageItem.get('costCenter').patchValue('');
    } else {
      this.isCollapsed = true;
      // this.patientCoverageItem.get('coverageSelected').patchValue(null);
    }
  }

  onPlanSelected(event) {
    if (event) {
      this.selectedPlan = event;
      this.planSelected = true;
      this.isCollapsed = false;
      this.patientCoverageItem.get('planSelected').patchValue(event);
      this.patientCoverageItem.updateValueAndValidity();
    }
  }

  populatePlan(data) {
    const coverageSelected = data;
    this.planSelect = coverageSelected.coveragePlans;
    const policyEndDate = this.patientCoverageItem.get('coverageSelected').value.endDate;
    const today = moment().format(DISPLAY_DATE_FORMAT);
    const isPolicyExpired = !moment(today, DISPLAY_DATE_FORMAT).isSameOrBefore(
      moment(policyEndDate, DISPLAY_DATE_FORMAT)
    );

    this.policyExpired = isPolicyExpired;
    this.patientCoverageItem.updateValueAndValidity();
  }

  populateMedicalCoverage() {
    const filteredMedicalCoverages = this.store.getMedicalCoverages().filter(element => {
      return element['status'] === 'ACTIVE' && element['coveragePlans'].length > 0;
    });
    this.medicalCoverages = filteredMedicalCoverages;
    this.medicalCoverageSelect = this.medicalCoverages;
    this.patientCoverageItem.updateValueAndValidity();
  }

  //------------------- hasUpdatePriority methods: Updating Visit Details --------------------//

  checkClick($event) {
    event.stopPropagation(); // Prevents bubbling of click event to parent DOM

    if (!this.patientCoverageItem.get('isSelected').value) {
      const medCovId = this.patientCoverageItem.get('medicalCoverageId').value;
      const planId = this.patientCoverageItem.get('planId').value;
      const coverageId = this.policyHolderInfo ? this.policyHolderInfo.id : '-';

      this.attachedMedicalCoverages.push(this.fb.group(new AttachedMedicalCoverage(medCovId, planId, coverageId)));

      this.selectedIndex = this.attachedMedicalCoverages.controls.length;
    } else {
      this.patientCoverageItem.get('isSelected').patchValue(false);
      this.removePlan();
    }
    this.patientCoverageItem.updateValueAndValidity();
  }

  isPlanSelected() {
    this.attachedMedicalCoverages.value.forEach(coverage => {
      if (this.patientCoverageItem.get('planId').value === coverage.planId) {
        this.patientCoverageItem.get('isSelected').patchValue(true);
        return true;
      }
    });
    console.log('plan is not selected');
    return false;
  }

  checkCompatibility() {
    return this.isCompatible;
  }

  getSubHeaderClass() {
    if (!this.isCollapsed) {
      return 'row modal-sub-header-expanded';
    } else {
      return 'row modal-sub-header';
    }
  }

  isExpired() {
    if (this.hasUpdatePriority && this.policyHolderInfo) {
      const endDate = this.policyHolderInfo.endDate;
      const today = moment().format(DISPLAY_DATE_FORMAT);
      const isExpired = moment(endDate).isBefore(today);
      const isActive = this.policyHolderInfo.status === 'ACTIVE' ? true : false;
      return isExpired;
    } else {
      return false;
    }
  }

  removePlan() {
    if (this.attachedMedicalCoverages) {
      if (this.patientCoverageItem.get('isNew').value) {
        this.attachedMedicalCoverages.value.map((coverage, index) => {
          if (
            coverage.medicalCoverageId === this.patientCoverageItem.get('medicalCoverageId').value &&
            coverage.planId === this.patientCoverageItem.get('planId').value
          ) {
            this.attachedMedicalCoverages.removeAt(index);
          }
        });
      } else {
        this.attachedMedicalCoverages.value.map((coverage, index) => {
          const coverageId = this.policyHolderInfo ? this.policyHolderInfo.id : '-';
          if (
            coverage.coverageId === coverageId &&
            coverage.medicalCoverageId === this.policyHolderInfo.medicalCoverageId &&
            coverage.planId === this.policyHolderInfo.planId
          ) {
            this.attachedMedicalCoverages.removeAt(index);
          }
        });
      }
    }
  }

  disableCheckBox() {
    let toDisable: boolean;

    const isSelected = this.patientCoverageItem.get('isSelected').value;
    const hasUpdatePriority = this.hasUpdatePriority;
    const isNew = this.policyHolderInfo ? false : true;
    toDisable = !this.checkCompatibility();

    if (toDisable) {
      return toDisable;
    } else {
      if (!isNew) {
        const holderStartDate = this.policyHolderInfo.startDate;
        const holderEndDate = this.policyHolderInfo.endDate;
        const policyEndDate = this.patientCoverageItem.get('coverageSelected').value.endDate;
        const today = moment().format(DISPLAY_DATE_FORMAT);
        const isHolderExpired = !moment(today, DISPLAY_DATE_FORMAT).isSameOrBefore(
          moment(holderEndDate, DISPLAY_DATE_FORMAT)
        );
        this.policyHolderExpired = isHolderExpired;

        const isPolicyExpired = !moment(today, DISPLAY_DATE_FORMAT).isSameOrBefore(
          moment(policyEndDate, DISPLAY_DATE_FORMAT)
        );
        this.policyExpired = isPolicyExpired;

        const validHolderEndDate =
          moment(holderEndDate, DISPLAY_DATE_FORMAT).isSameOrBefore(moment(policyEndDate, DISPLAY_DATE_FORMAT)) &&
          moment(holderStartDate, DISPLAY_DATE_FORMAT).isSameOrBefore(moment(holderEndDate, DISPLAY_DATE_FORMAT));
        const isActive = this.policyHolderInfo.status === 'ACTIVE' ? true : false;

        if (isActive && !isHolderExpired && !isPolicyExpired && validHolderEndDate) {
          toDisable = false;
        } else {
          if (isSelected) {
            this.patientCoverageItem.get('isSelected').patchValue(false);
            this.removePlan();
          }
          toDisable = true;
        }
      }

      return toDisable;
    }
  }
}

export function notBeforeToday(startDate, endDate: AbstractControl): ValidatorFn {
  return (control: AbstractControl) => {
    const isPolicyExpired = validateOrderOfDates(startDate, endDate.value);
    if (isPolicyExpired) {
      return {
        policyExpired: {
          value: moment(endDate.value, DISPLAY_DATE_FORMAT),
          message: 'End date must not be before today.'
        }
      };
    } else {
      return null;
    }
  };
}

export function validateAgainstMC(startDate: AbstractControl, endDate: AbstractControl): ValidatorFn {
  return (control: AbstractControl) => {
    const sDate = startDate.value['endDate'];
    const isPolicyExpired = validateOrderOfDates(endDate.value, sDate);
    if (isPolicyExpired) {
      return {
        mcEndDateAfterPolicy: {
          value: moment(endDate.value, DISPLAY_DATE_FORMAT),
          message: 'End date must not be beyond medical coverage end date.'
        }
      };
    } else {
      return null;
    }
  };
}

function validateOrderOfDates(startDate, endDate) {
  const isStartValid = moment(startDate, DISPLAY_DATE_FORMAT).isValid();
  const isEndValid = moment(endDate, DISPLAY_DATE_FORMAT).isValid();
  const sDate = isStartValid ? startDate : moment(startDate).format(DISPLAY_DATE_FORMAT);
  const eDate = isEndValid ? endDate : moment(endDate).format(DISPLAY_DATE_FORMAT);
  const isPolicyExpired = moment(eDate, DISPLAY_DATE_FORMAT).isBefore(moment(sDate, DISPLAY_DATE_FORMAT));
  return isPolicyExpired;
}
