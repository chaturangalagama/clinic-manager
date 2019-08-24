import { AlertService } from './../../../../services/alert.service';
import { ApiPatientInfoService } from './../../../../services/api-patient-info.service';
import { StoreService } from './../../../../services/store.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MedicalCoverageAdd, CoveragePlan } from './../../../../objects/MedicalCoverageAdd';
import { Component, OnInit } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { IOption } from 'ng-select';
import { MedicalCoverageSelected, CoverageSelected, SelectedPlan } from '../../../../objects/MedicalCoverage';

@Component({
  selector: 'app-assign-medical-coverage',
  templateUrl: './assign-medical-coverage.component.html',
  styleUrls: ['./assign-medical-coverage.component.scss']
})
export class AssignMedicalCoverageComponent implements OnInit {
  public event: EventEmitter<any> = new EventEmitter();
  medicalCoverages: FormArray;
  itemArray: FormArray;
  plans = [];

  constructor(
    private bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private store: StoreService,
    private apiPatientInfoService: ApiPatientInfoService,
    private alertService: AlertService
  ) {
    this.itemArray = this.fb.array([]);
  }

  ngOnInit() {
    if (!this.medicalCoverages) {
      this.medicalCoverages = this.fb.array([this.initChildFormGroup()]);
    }

    this.store.errorMessages.forEach(err => {
      this.alertService.error(err);
    });
  }

  initChildFormGroup() {
    const newFormGroup = this.createChildFormGroup();

    return newFormGroup;
  }

  createChildFormGroup(selectedPlan?: SelectedPlan) {
    let newFormGroup;

    if (selectedPlan) {
      newFormGroup = this.fb.group({
        patientCoverageId: [selectedPlan.patientCoverageId, Validators.required],
        isSelected: selectedPlan.isSelected,
        medicalCoverageId: [selectedPlan.medicalCoverageId, Validators.required],
        planRows: selectedPlan.planRows,
        planId: [selectedPlan.planId, Validators.required],

        coverageSelected: this.fb.group(new MedicalCoverageSelected()),
        planSelected: this.fb.group(new CoverageSelected()),
        coverageType: '',
        startDate: '',
        endDate: '',
        remarks: '',
        costCenter: ''
        // isNew: true
        // TODO: Changed to pass in data
        // coverageSelected: this.fb.group(selectedPlan.coverageSelected),
        // planSelected: this.fb.group(selectedPlan.planSelected)
      });
    } else {
      newFormGroup = this.fb.group({
        patientCoverageId: ['', Validators.required],
        isSelected: false,
        medicalCoverageId: ['', Validators.required],
        planRows: '',
        planId: ['', Validators.required],
        coverageSelected: this.fb.group(new MedicalCoverageSelected()),
        planSelected: this.fb.group(new CoverageSelected()),
        coverageType: '',
        isNew: true,
        startDate: '',
        endDate: '',
        remarks: '',
        costCenter: ''
      });
    }

    return newFormGroup;
  }

  addNewItem() {
    this.itemArray.push(this.initChildFormGroup());
  }

  onBtnSaveClicked() {
    this.event.emit(this.itemArray);
  }

  onDelete(index) {
    if (!this.itemArray.value[index].isNew && this.itemArray.value[index].id !== undefined) {
      this.apiPatientInfoService
        .removePolicy(
          this.itemArray.value[index].id,
          this.itemArray.value[index].coverageType,
          this.itemArray.value[index].medicalCoverageId,
          this.itemArray.value[index].planId
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

    this.itemArray.removeAt(index);
  }

  onBtnExit() {
    console.log('this.itemArray: ', this.itemArray);

    this.itemArray.value.forEach((item, index) => {
      if (item.planId === '' || item.medicalCoverageId === '' || item.patientCoverageId === '') {
        this.itemArray.removeAt(index);
      }
    });
    this.bsModalRef.hide();
  }
}

class MedicalCoverageOptions<T> implements IOption {
  value: string;
  label: string;
  disabled?: boolean;
  data: T;
}

export class SelectedItem {
  coverageSelected: MedicalCoverageAdd;
  planSelected: CoveragePlan;
  employeeNo: string;
  planRows: Array<MedicalCoverageOptions<CoveragePlan>> = [];
  showExtra = false;
  isSelected = false;

  constructor() {}
}
