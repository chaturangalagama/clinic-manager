import { SelectedPlans } from './../../../objects/MedicalCoverage';
import { Component, OnInit, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-patient-add-medical-coverage-summary',
  templateUrl: './patient-add-medical-coverage-summary.component.html',
  styleUrls: ['./patient-add-medical-coverage-summary.component.scss']
})
export class PatientAddMedicalCoverageSummaryComponent implements OnInit {
  @Input() medicalCoverageFormArray: FormArray;
  @Input() selectedPlans: SelectedPlans[];
  @Input() hasUpdatePriority: boolean;
  displayIncompatibleMessage: boolean = false;
  incompatibilityMatrix: boolean[];

  @Input() attachedMedicalCoverages: FormArray;
  @Output() updateChange = new EventEmitter();

  isSelected: boolean;
  isCollapsed: boolean[];

  constructor(private eRef: ElementRef) { }

  ngOnInit() { }

  collapsed(event: any): void {
    console.log(event);
  }

  expanded(event: any): void {
    console.log(event);
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.eRef.nativeElement.contains(event.target)) {
      this.updateChange.emit(this.attachedMedicalCoverages);
    } else { }
  }

  isCurrentPlan(coverage, coverageSelected) {
    if (
      coverageSelected.medicalCoverageId === coverage.get('medicalCoverageId').value &&
      coverageSelected.planId === coverage.get('planId').value
    ) {
      return true;
    } else {
      return false;
    }
  }

  checkAgainstSelectedCoverages(medicalCoverageType, medicalCoverage, index) {
    //get current item
    let isCompatible = true;
    const selectedCoverages = this.attachedMedicalCoverages;

    this.incompatibilityMatrix = [];

    selectedCoverages.value.forEach(coverage => {
      if (!this.isCurrentPlan(medicalCoverage, coverage)) {
        const attachedCoverageType = coverage.coverageType;
        if (!this.checkCompatibility(attachedCoverageType, medicalCoverageType)) {
          isCompatible = false;
        }
      } else {
        isCompatible = true;
      }
    });

    return isCompatible;
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
    const index = this.attachedMedicalCoverages.value.findIndex(element => {
      return (
        element.medicalCoverageId === item.get('medicalCoverageId').value && element.planId === item.get('planId').value
      );
    });
    console.log("ATTACH SELECTED: ", this.attachedMedicalCoverages);
    this.updateChange.emit(this.attachedMedicalCoverages);
    return index + 1;
  }
}
