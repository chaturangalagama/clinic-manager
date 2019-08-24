import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-patient-add-medical-coverage-summary-item',
  templateUrl: './patient-add-medical-coverage-summary-item.component.html',
  styleUrls: ['./patient-add-medical-coverage-summary-item.component.scss']
})
export class PatientAddMedicalCoverageSummaryItemComponent implements OnInit {
  @Input() medicalCoverageItem: FormGroup;
  @Input() index;
  @Input() attachedMedicalCoverages: FormArray;
  @Output() updateChange = new EventEmitter();
  @Input() itemChecked;
  @Input() isCompatible: boolean;
  @Input() selectedIndex: number;
  isChecked: false;

  isCollapsed = true;

  displayData: any;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.displayData = this.medicalCoverageItem.value;
    if (this.index === 0) {
      this.isCollapsed = false;
    }

    this.subscribeChanges();
  }

  subscribeChanges() {
    this.attachedMedicalCoverages.valueChanges.pipe(debounceTime(300)).subscribe(data => {
      this.isDisabled();
    });
  }
  checkClick() {

    if (!this.isChecked) {
      console.log("this.attachedMedicalCoverages: ", this.attachedMedicalCoverages);
      this.medicalCoverageItem.get('isSelected').patchValue(true);
      this.attachedMedicalCoverages.push(this.medicalCoverageItem);
      this.updateChange.emit(this.attachedMedicalCoverages);
    } else {
      this.removePlan();
      this.medicalCoverageItem.get('isSelected').patchValue(false);
    }

    this.selectedIndex = this.attachedMedicalCoverages.controls.length;
  }

  isDisabled() {
    if (!this.isCompatible) {
      this.medicalCoverageItem.get('isSelected').disable();
    } else {
      this.medicalCoverageItem.get('isSelected').enable();
    }
  }

  removePlan() {
    console.log('Remove Plan');
    this.attachedMedicalCoverages.controls.map((formControl, index) => {
      console.log('Remove Plan', formControl);
      if (
        formControl.value.medicalCoverageId === this.medicalCoverageItem.get('medicalCoverageId').value &&
        formControl.value.planId === this.medicalCoverageItem.get('planId').value
      ) {
        this.attachedMedicalCoverages.removeAt(index);
      }
    });
  }

  checkCompatibility() {
    return this.isCompatible;
  }
}
