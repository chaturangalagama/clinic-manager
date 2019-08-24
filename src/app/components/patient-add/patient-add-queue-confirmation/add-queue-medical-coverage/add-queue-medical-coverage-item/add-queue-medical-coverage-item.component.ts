import { FormArray, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AttachedMedicalCoverage } from '../../../../../objects/AttachedMedicalCoverage';

@Component({
  selector: 'app-add-queue-medical-coverage-item',
  templateUrl: './add-queue-medical-coverage-item.component.html',
  styleUrls: ['./add-queue-medical-coverage-item.component.scss']
})
export class AddQueueMedicalCoverageItemComponent implements OnInit {
  // actual item
  @Input() item: any;
  // Selected Medical Coverages
  @Input() attachedMedicalCoverages: FormArray;
  @Input() index: number;
  @Input() isHead: boolean;
  @Input() isCompatible: boolean;
  @Input() selectedCoverages: Array<AttachedMedicalCoverage>;

  //   @Input() patientCoverages: FormArray;
  @Output() updateChange = new EventEmitter<Array<AttachedMedicalCoverage>>();

  @Input() isChecked;

  @Input() selectedIndex: number;
  @Input() forDisplayOnly: boolean;

  isCollapsed = true;
  // planData: any;
  constructor(private fb: FormBuilder) {
    // this.planData = new Array();
  }

  ngOnInit() {
    this.initialCheck();
    if (this.isHead) {
      this.isCollapsed = false;
    } else {
      this.isCollapsed = true;
    }

    if (this.forDisplayOnly) {
      this.isCollapsed = false;
    }

    console.log('ITEM ITEM: ', this.item);

    console.log("forDisplayOnly: ", this.forDisplayOnly);
  }

  initialCheck() {
    if (this.isChecked) {
      //   this.updateChange.emit(new AttachedMedicalCoverage(this.item.policyHolder.medicalCoverageId, this.item.coveragePlan.id));
      this.filterEmptyCoverage();
      this.attachedMedicalCoverages.push(
        this.fb.group(
          new AttachedMedicalCoverage(
            this.item.policyHolder.medicalCoverageId,
            this.item.coveragePlan.id,
            this.item.policyHolder.id
          )
        )
      );
    } else {
      // remove
      this.removePlan();
    }
  }

  checkClick() {
    if (!this.isChecked) {  //IF NOT CHECKED
      this.filterEmptyCoverage();
      this.disableIncompatibleCoverages();
      this.attachedMedicalCoverages.push(
        this.fb.group(
          new AttachedMedicalCoverage(
            this.item.policyHolder.medicalCoverageId,
            this.item.coveragePlan.id,
            this.item.policyHolder.id
          )
        )
      );

      this.selectedCoverages.push(
        {
          medicalCoverageId: this.item.policyHolder.medicalCoverageId,
          planId: this.item.coveragePlan.id,
          coverageId: this.item.policyHolder.id
        });


      this.updateChange.emit(this.selectedCoverages);
      this.selectedIndex = this.attachedMedicalCoverages.controls.length;
    } else {
      // remove
      this.removePlan();
    }
    console.log('Click12', this.attachedMedicalCoverages.value);
  }

  disableIncompatibleCoverages() {
    console.log('attachedMedicalCoverages: ', this.attachedMedicalCoverages);
  }

  filterEmptyCoverage() {
    this.attachedMedicalCoverages.controls.map((formControl, index) => {
      if (!formControl.value.patientCoverageId && !formControl.value.medicalCoverageId && !formControl.value.planId) {
        this.attachedMedicalCoverages.removeAt(index);
      }
    });
  }

  removePlan() {
    this.attachedMedicalCoverages.controls.map((formControl, index) => {
      if (
        formControl.value.coverageId === this.item.policyHolder.id &&
        formControl.value.medicalCoverageId === this.item.policyHolder.medicalCoverageId &&
        formControl.value.planId === this.item.policyHolder.planId
      ) {
        this.attachedMedicalCoverages.removeAt(index);
      }
    });

    this.selectedCoverages.map((coverage, index) => {
      if (
        coverage.coverageId === this.item.policyHolder.id &&
        coverage.medicalCoverageId === this.item.policyHolder.medicalCoverageId &&
        coverage.planId === this.item.policyHolder.planId
      ) {
        this.selectedCoverages.splice(index, 1);
        this.updateChange.emit(this.selectedCoverages);
      }
    });
  }

  getSubHeaderClass() {
    if (!this.isCollapsed) {
      return 'row modal-sub-header modal-input1 pt-2 pl-3';
    } else {
      return 'row modal-sub-header-expanded modal-input1 pt-2 pl-3';
    }
  }
}
