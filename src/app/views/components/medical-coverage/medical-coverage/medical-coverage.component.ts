import { MedicalCoverageFormService } from './../../../../services/medical-coverage-form.service';
import { ApiPatientInfoService } from './../../../../services/api-patient-info.service';
import { StoreService } from './../../../../services/store.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AlertService } from '../../../../services/alert.service';

import {
  AssignMedicalCoverageComponent,
  SelectedItem
} from './../../../../views/components/medical-coverage/assign-medical-coverage/assign-medical-coverage.component';
import { MedicalCoverageResponse } from './../../../../objects/response/MedicalCoverageResponse';
import { Component, OnInit, Input, EventEmitter, ElementRef } from '@angular/core';
import {
  SelectedPlan,
  MedicalCoverageSelected,
  PolicyHolderInfo,
  CoverageSelected
} from '../../../../objects/MedicalCoverage';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
  AbstractControl,
  ValidatorFn
} from '@angular/forms';
import { MedicalCoverageAdd, CoveragePlan } from './../../../../objects/MedicalCoverageAdd';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MEDICAL_COVERAGES, DISPLAY_DATE_FORMAT, INPUT_DELAY } from './../../../../constants/app.constants';
import { AttachedMedicalCoverage } from '../../../../objects/AttachedMedicalCoverage';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-medical-coverage',
  templateUrl: './medical-coverage.component.html',
  styleUrls: ['./medical-coverage.component.scss']
})
export class MedicalCoverageComponent implements OnInit {
  // Information Inputs
  @Input() patientCoverages: FormArray;
  @Input() selectedCoverages: FormArray;
  @Input() policyHolderInfo: FormArray;

  // Boolean Variables for UI customisation
  @Input() hasUpdatePriority: boolean;
  @Input() hasDelete: boolean;
  @Input() hasAdd: boolean;
  @Input() popUpAddCoverage: boolean; // For Patient Add and Patient Detail to add new MCs
  @Input() displaySelectedCoverages: boolean;

  bsModalRef: BsModalRef;
  isCollapsed: boolean;

  public event: EventEmitter<any> = new EventEmitter();
  selectedItems: SelectedItem[];
  isAllEmployeeNoEntered = false;
  medicalCoverages = MEDICAL_COVERAGES;
  coverages;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private eRef: ElementRef,
    private store: StoreService,
    private alertService: AlertService,
    private apiPatientInfoService: ApiPatientInfoService,
    private medicalCoverageFormService: MedicalCoverageFormService
  ) {}

  ngOnInit() {
    this.initPolicyHolderInfo();

    this.initMedicalCoverages();
  }

  //------------------- Initialise Info methods --------------------//

  initPolicyHolderInfo() {
    if (!this.policyHolderInfo) {
      this.policyHolderInfo = this.fb.array([]);
    }
  }

  initMedicalCoverages() {
    if (!this.selectedCoverages) {
      this.selectedCoverages = this.fb.array([]);
      this.selectedCoverages.valueChanges.subscribe(value => {
        console.log('con-pa VALUE CHANGES: ', value);
      });
    }

    if (!this.patientCoverages.value) {
      this.apiPatientInfoService.searchBy('systemuserid', this.store.getPatientId()).subscribe(
        res => {
          const patientInfo = res.payload;

          this.apiPatientInfoService.searchAssignedPoliciesByUserId(patientInfo['userId']).subscribe(
            value => {
              if (value.payload) {
                this.coverages = new MedicalCoverageResponse(
                  value.payload.INSURANCE,
                  value.payload.CORPORATE,
                  value.payload.CHAS,
                  value.payload.MEDISAVE
                );

                this.populateData(this.coverages);
                console.log('COVERAGES: ', this.patientCoverages);
              }
            },
            err => {
              this.alertService.error(JSON.stringify(err.error.message));
            }
          );
        },
        err => {
          this.alertService.error(JSON.stringify(err.error.message));
        }
      );
    }
  }

  populateData(array: MedicalCoverageResponse) {
    // Initialise Patient Coverages and Policy Holder

    this.patientCoverages = this.fb.array([]);

    for (const key of Object.keys(array)) {
      if (array[key].length > 0) {
        array[key].forEach(element => {
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

          const planFG = this.fb.group(plan);
          const today = moment().format(DISPLAY_DATE_FORMAT);
          const endDate = planFG.get('endDate');

          planFG
            .get('endDate')
            .setValidators([
              notBeforeToday(today, endDate),
              validateAgainstMC(planFG.get('coverageSelected'), endDate),
              Validators.required
            ]);
          this.patientCoverages.push(planFG);
        });
      }
    }

    console.log('PATIENT COVERAGES: ', this.patientCoverages);

    this.filterSelectedCoverages();
  }

  toDisplay(coverage) {
    if (this.selectedCoverages && this.selectedCoverages.value && this.selectedCoverages.length > 0) {
      let policyAttached = false;
      this.selectedCoverages.controls.forEach(control => {
        const controlMedicalCoverageId = control.get('medicalCoverageId').value;
        const controlPlanId = control.get('planId').value;
        policyAttached =
          controlMedicalCoverageId === coverage.medicalCoverageId && controlPlanId === coverage.planId ? true : false;
      });
      if (!policyAttached) {
        // this.displaySelectedCoverages = false;
        return false;
      } else {
        return true;
      }
    }
  }

  //------------------- hasAdd methods: Adding New Coverages  --------------------//

  onbtnDeleteClicked(index, $event) {
    const deleteConfirm = confirm('Are you sure you want to delete coverage?');

    if (deleteConfirm) {
      const coverageToDelete = this.patientCoverages.at(index);

      if (!coverageToDelete.get('isNew').value) {
        this.apiPatientInfoService
          .removePolicy(
            this.policyHolderInfo.at(index).get('id').value,
            coverageToDelete.get('coverageType').value,
            coverageToDelete.get('medicalCoverageId').value,
            coverageToDelete.get('planId').value
          )
          .subscribe(
            resp => {
              console.log('success');
              this.patientCoverages.removeAt(index);
              this.policyHolderInfo.removeAt(index);
            },
            err => {
              this.alertService.error('Error from medical coverage removal', err);
            }
          );
      } else {
        this.patientCoverages.removeAt(index);
        this.policyHolderInfo.removeAt(index);
      }
    }
  }

  onBtnSaveClicked() {
    this.event.emit(this.patientCoverages);
  }

  onEmployeeIdChanged() {
    this.isAllEmployeeNoEntered = true;

    this.selectedItems.map((value, index) => {
      if (!value.employeeNo || value.employeeNo.trim().length === 0) {
        console.log('isAllEmployeeNoEntered', this.isAllEmployeeNoEntered);
        this.isAllEmployeeNoEntered = false;
        return;
      }
    });
  }

  addMedicalCoverage(event) {
    const initialState = {
      title: 'Medical Coverage',
      patientCoverages: this.patientCoverages,
      policyHolderInfo: this.policyHolderInfo,
      popUpAddCoverage: false,
      hasAdd: true,
      hasDelete: true
    };

    this.bsModalRef = this.modalService.show(MedicalCoverageComponent, {
      initialState,
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    });

    this.bsModalRef.content.event.subscribe(data => {
      if (data) {
        this.patientCoverages.updateValueAndValidity();
        this.bsModalRef.hide();
      }
    });
  }

  addNewItem() {
    const plan = new SelectedPlan(
      false,
      '',
      '',
      '',
      '',
      new MedicalCoverageSelected(),
      new CoverageSelected(),
      '',
      '',
      '',
      '',
      true,
      ''
    );

    const formGroup: FormGroup = this.fb.group(plan);

    formGroup.setControl('patientCoverageId', new FormControl('', Validators.required));
    formGroup.setControl('medicalCoverageId', new FormControl('', Validators.required));
    formGroup.setControl('planId', new FormControl('', Validators.required));
    // formGroup.get('startDate').setValidators([this.validatePolicyHolderEndDate, Validators.required]);
    const today = moment().format(DISPLAY_DATE_FORMAT);
    const endDate = formGroup.get('endDate');

    formGroup
      .get('endDate')
      .setValidators([
        notBeforeToday(today, endDate),
        validateAgainstMC(formGroup.get('coverageSelected'), endDate),
        Validators.required
      ]);

    this.patientCoverages.push(formGroup);
    this.patientCoverages.updateValueAndValidity();
  }

  //------------------- hasUpdatePriority methods: Updating Visit Details --------------------//

  filterSelectedCoverages() {
    // Filter Coverages that are not assigned to patient anymore,
    // i.e deleted coverages but still may be attached to patient
    //     consultation through separate API

    if (!this.selectedCoverages) {
      this.selectedCoverages = this.fb.array([]);
    } else {
      this.selectedCoverages.value.map((coverage, counter) => {
        const policyFound = this.patientCoverages.value.find(existingCoverage => {
          return existingCoverage.planId === coverage.planId;
        });

        if (!policyFound) {
          this.selectedCoverages.removeAt(counter);
        }
      });
    }
  }

  getMedicalCoverageType(coverageSelected) {
    let type = '';

    const patientCoverages = this.patientCoverages.value;

    patientCoverages.forEach(coverage => {
      if (
        coverageSelected.medicalCoverageId === coverage.medicalCoverageId &&
        coverageSelected.planId === coverage.planId
      ) {
        type = coverage.coverageType;
      }
    });
    return type;
  }

  isCurrentPlan(coverage: FormGroup, coverageSelected) {
    return coverageSelected.medicalCoverageId === coverage.get('medicalCoverageId').value &&
      coverageSelected.planId === coverage.get('planId').value
      ? true
      : false;
  }

  checkCompatibility(current, sibling) {
    const insurance = 'INSURANCE';
    const corporate = 'CORPORATE';
    const chas = 'CHAS';
    const medisave = 'MEDISAVE';

    if (current === insurance && sibling === insurance) {
      return false;
    } else if ((current === insurance && sibling === corporate) || (sibling === insurance && current === corporate)) {
      return false;
    } else if (current === corporate && sibling === corporate) {
      return false;
    } else if (current === chas && sibling === chas) {
      return false;
    } else if (current === medisave && sibling === medisave) {
      return false;
    } else {
      return true;
    }
  }

  checkAgainstSelectedCoverages(currentCoverage, index) {
    // Check whether currently sibling coverages are compatible
    // with currently selected coverage

    let toDisable = false;
    const selectedCoveragesForConsultation = this.selectedCoverages.value;

    selectedCoveragesForConsultation.forEach(siblingCoverage => {
      if (!this.isCurrentPlan(currentCoverage, siblingCoverage)) {
        // Checking against other sibling coverages
        const siblingCoverageType = this.getMedicalCoverageType(siblingCoverage);
        const currentCoverageType = currentCoverage.get('coverageType').value;

        if (!this.checkCompatibility(currentCoverageType, siblingCoverageType)) {
          toDisable = true;
        }
      } else {
        // Don't need to check against itself
        toDisable = false;
      }
    });
    return toDisable;
  }

  getSelectedIndex(item) {
    // Get item's index upon selection
    let index = 0;
    this.selectedCoverages.value.forEach((coverage, counter) => {
      if (
        item.get('medicalCoverageId').value === coverage.medicalCoverageId &&
        item.get('planId').value === coverage.planId
      ) {
        item.get('isSelected').patchValue(true);
        index = counter + 1;
      }
    });
    return index;
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
    const isPolicyExpired = validateOrderOfDates(sDate, endDate.value);
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
  const isPolicyExpired = moment(eDate, DISPLAY_DATE_FORMAT).isSameOrBefore(moment(sDate, DISPLAY_DATE_FORMAT));
  return isPolicyExpired;
}
