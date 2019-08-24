import { SelectedPlan } from './../../../objects/MedicalCoverage';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import * as moment from 'moment';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-patient-add-confirmation',
  templateUrl: './patient-add-confirmation.component.html',
  styleUrls: ['./patient-add-confirmation.component.scss']
})
export class PatientAddConfirmationComponent implements OnInit {
  @Input() confirmationFormGroup: FormGroup;
  @Input() attachedMedicalCoverages: FormArray;
  @Output() updateChange = new EventEmitter();
  consultationFormGroup: FormGroup;
  @Input() selectedCoverages: FormArray;
  public event: EventEmitter<any> = new EventEmitter();

  title: string;
  selectedPlans: FormArray;

  // DATA BINDING
  consultationInfo = [
    {
      preferredDoctor: '',
      remarks: '',
      purposeOfVisit: '',
      visitDate: '',
      time: '',
      attachedMedicalCoverages: [],
    }
  ];
  visitDate: Date;
  time: string;
  preferredDoctor: string;
  remarks: string;
  purposeOfVisit: string;

  indexesOfCheckedPlans = [];

  // HAN
  // input from parent who called this pop-up
  selectedPlan: Array<SelectedPlan>;

  //HAN
  constructor(
    private fb: FormBuilder
  ) {
    this.selectedPlans = this.fb.array([]);
    this.selectedCoverages = this.fb.array([]);
  }

  onBtnSaveClicked($event) {
    this.consultationInfo[1] = this.selectedPlans.value;
    this.consultationInfo[2] = this.selectedCoverages.value;
    this.event.emit(this.consultationInfo);
  }

  reduceAttachedCoverages() {
    const coverages = [];
    this.attachedMedicalCoverages.value.forEach(coverage => {
      coverages.push({
        medicalCoverageId: coverage.medicalCoverageId,
        planId: coverage.planId
      });
    });

    return coverages;
  }

  ngOnInit() {
    if (this.selectedPlan) {
      this.convertSelectedPlanToFormArray();
    }
    console.log('existing plan', this.selectedPlan);
    this.attachedMedicalCoverages = this.fb.array([]);

    this.consultationFormGroup = this.createConsultationPage();
    this.confirmationFormGroup = this.createConfirmationFormGroup();
    this.subscribeToValueChanges();
  }

  convertSelectedPlanToFormArray() {
    this.selectedPlan.forEach(item => {
      this.selectedPlans.push(this.fb.group(item));
    });
  }

  createConfirmationFormGroup(): FormGroup {
    return this.fb.group({
      selectedItems: ''
    });
  }

  subscribeToValueChanges() {
    this.consultationFormGroup.valueChanges
      .pipe(debounceTime(50), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(values => {
        this.remarks = values.remarks;
        this.visitDate = values.visitDate;
        this.purposeOfVisit = values.purposeOfVisit;
        this.preferredDoctor = values.preferredDoctor;
        this.time = moment(values.time).format('MM-DD-YYYY');

        this.consultationInfo[0].remarks = values.remarks;
        this.consultationInfo[0].purposeOfVisit = values.purposeOfVisit;
        this.consultationInfo[0].preferredDoctor = values.preferredDoctor;
        this.consultationInfo[0].attachedMedicalCoverages = this.reduceAttachedCoverages();

        console.log("Tthis.consultationInfo[0]: ", this.consultationInfo[0]);
        console.log("THIS ATTACHED MEDICAL: ", this.attachedMedicalCoverages);
      });

  }

  createConsultationPage(): FormGroup {
    console.log('returning Consultation Page Form');
    return this.fb.group({
      visitDate: new FormControl(),
      time: '', // '930',
      preferredDoctor: '', // ,
      purposeOfVisit: '', // ,
      remarks: '' // ,
    });
  }
}
