import { MEDICAL_COVERAGES } from './../../../../constants/app.constants';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AttachedMedicalCoverage } from '../../../../objects/AttachedMedicalCoverage';

@Component({
  selector: 'app-add-queue-medical-coverage',
  templateUrl: './add-queue-medical-coverage.component.html',
  styleUrls: ['./add-queue-medical-coverage.component.scss']
})
export class AddQueueMedicalCoverageComponent implements OnInit {
  @Input() medicalCoverageFormGroup: FormGroup;
  @Input() selectedCoverages: Array<AttachedMedicalCoverage>;
  @Input() forDisplayOnly: boolean;
  @Output() updateChange = new EventEmitter<Array<AttachedMedicalCoverage>>();
  displayIncompatibleMessage = false;
  incompatibilityMatrix: boolean[];

  medicalCoverages = MEDICAL_COVERAGES;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.displayIncompatibleMessage = false;
    this.incompatibilityMatrix = [];

    this.filterSelectedCoverages();

    console.log('forDisplayOnly: ', this.forDisplayOnly);
    console.log("selected coverages: ", this.selectedCoverages);
  }

  isPlanSelected(medicalCoverage) {
    const { policyHolder, coveragePlan } = medicalCoverage;

    const result = this.selectedCoverages.find(element => {
      return element.medicalCoverageId === policyHolder.medicalCoverageId && element.planId === coveragePlan.id;
    });

    if (result) {
      return true;
    } else {
      return false;
    }
  }

  getMedicalCoverageType(coverageSelected) {
    const patientCoverages = this.medicalCoverageFormGroup.get('patientCoverages').value;

    let type = '';
    this.medicalCoverages.forEach(coverageType => {
      patientCoverages[coverageType].forEach(coverage => {
        if (
          coverageSelected.medicalCoverageId === coverage.policyHolder.medicalCoverageId &&
          coverageSelected.planId === coverage.coveragePlan.id
        ) {
          type = coverageType;
          return type;
        }
      });
    });
    return type;
  }

  isCurrentPlan(coverage, coverageSelected) {
    if (
      coverageSelected.medicalCoverageId === coverage.policyHolder.medicalCoverageId &&
      coverageSelected.planId === coverage.coveragePlan.id
    ) {
      return true;
    } else {
      return false;
    }
  }

  filterSelectedCoverages() {
    // Filter Coverages that are not assigned to patient anymore, 
    // i.e deleted coverages but still may be attached to patient 
    //     consultation through separate API

    const patientCoverages = this.medicalCoverageFormGroup.get('patientCoverages').value;

    if(patientCoverages)
    {
        if (!this.selectedCoverages) {
          this.selectedCoverages = new Array<AttachedMedicalCoverage>();
        } else {
          this.selectedCoverages.map((coverage, counter) => {
            const policyFound = patientCoverages.find(existingCoverage => {
              return (existingCoverage.medicalCoverageId === coverage.medicalCoverageId
                && existingCoverage.planId === coverage.planId)
            });
            if (!policyFound) {
              this.selectedCoverages.splice(counter, 1);
            }
          });
        }
      }
  }

  filterDisplayedCoverages() {
    const patientCoverages = this.medicalCoverageFormGroup.get('patientCoverages').value;

    patientCoverages.value.map((coverage, counter) => {
      const policyAttached = this.selectedCoverages.find(selectedCoverage => {
        return (selectedCoverage.medicalCoverageId === coverage.medicalCoverageId
          && selectedCoverage.planId === coverage.planId)
      });
      if (!policyAttached) {
        patientCoverages.removeAt(counter);
      }
    });
  }

  checkAgainstSelectedCoverages(medicalCoverageType, medicalCoverage, index) {
    //get current item
    let toDisable = false;
    const selectedCoverages = this.medicalCoverageFormGroup.get('attachedMedicalCoverages').value;

    this.incompatibilityMatrix = [];

    selectedCoverages.forEach(coverage => {
      if (!this.isCurrentPlan(medicalCoverage, coverage)) {
        const attachedCoverageType = this.getMedicalCoverageType(coverage);
        if (!this.checkCompatibility(attachedCoverageType, medicalCoverageType)) {
          toDisable = true;
        }
      } else {
        toDisable = false;
      }
    });

    return toDisable;
  }

  checkCompatibility(coverageTypeSelected, siblingCoverageType) {
    const insurance = 'INSURANCE';
    const corporate = 'CORPORATE';
    const chas = 'CHAS';
    const medisave = 'MEDISAVE';

    if (
      coverageTypeSelected === insurance &&
      siblingCoverageType === insurance
    ) {
      return false;
    } else if (
      (coverageTypeSelected === insurance && siblingCoverageType === corporate) ||
      (siblingCoverageType === insurance && coverageTypeSelected === corporate)
    ) {
      return false;
    } else if (
      coverageTypeSelected === corporate &&
      siblingCoverageType === corporate
    ) {
      return false;
    } else if (coverageTypeSelected === chas && siblingCoverageType === chas) {
      return false;
    } else if (coverageTypeSelected === medisave && siblingCoverageType === medisave) {
      return false;
    } else {
      return true;
    }
  }

  getSelectedIndex(item) {
    // current selection pool
    // const selectedMedicalCoverageFormArray: FormArray = <FormArray>this.medicalCoverageFormGroup.get(
    //   'attachedMedicalCoverages'
    // );

    const selectedMedicalCoverageArray = this.selectedCoverages;
    this.updateChange.emit(this.selectedCoverages);

    let index = selectedMedicalCoverageArray.findIndex(element => {
      return (
        element.medicalCoverageId === item.policyHolder.medicalCoverageId && element.planId === item.coveragePlan.id
      );
    });

    index = index + 1;
    return index;
  }
}
