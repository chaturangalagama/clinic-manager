import { AlertService } from './../../../services/alert.service';
import { MedicalCoverageResponse } from './../../../objects/response/MedicalCoverageResponse';
import { ApiPatientInfoService } from './../../../services/api-patient-info.service';
import { StoreService } from './../../../services/store.service';
import { SelectedItem } from './../../../views/components/medical-coverage/assign-medical-coverage/assign-medical-coverage.component';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { AttachedMedicalCoverage } from '../../../objects/AttachedMedicalCoverage';
import * as moment from 'moment';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-patient-add-queue-confirmation',
  templateUrl: './patient-add-queue-confirmation.component.html',
  styleUrls: ['./patient-add-queue-confirmation.component.scss']
})
export class PatientAddQueueConfirmationComponent implements OnInit {
  @Input() hiddenTabs: boolean;
  @Output() updateChange = new EventEmitter<Array<AttachedMedicalCoverage>>();
  // @Input() selectedCoverages: Array<AttachedMedicalCoverage>;
  selectedCoverages: FormArray;

  confirmationInput: SelectedItem[];
  consultationFormGroup: FormGroup;
  patientAddFormGroup: FormGroup;
  medicalCoverageSummaryFormGroup: FormGroup;
  selectedItems: SelectedItem[] = [];
  public event: EventEmitter<any> = new EventEmitter();
  tabRefresh: boolean;
  // selectedPlans: Array<Coverage>;

  // Input Data
  title: string;
  type: string; // UNDEFINED || ATTACH_MEDICAL_COVERAGE
  // Input Data
  patientPlans: FormArray;
  coverages: MedicalCoverageResponse;

  // DATA BINDING
  consultationInfo = {
    preferredDoctor: '',
    remarks: '',
    purposeOfVisit: '',
    priority: '',
    visitDate: '',
    time: '',
    attachedMedicalCoverages: ''
  };
  visitDate: Date;
  time: string;
  preferredDoctor: string;
  remarks: string;
  purposeOfVisit: string;
  hasUpdatePriority: boolean;

  indexesOfCheckedPlans = [];

  constructor(
    private fb: FormBuilder,
    private store: StoreService,
    private apiPatientInfoService: ApiPatientInfoService,
    private alertService: AlertService,
    private bsModalRef: BsModalRef
  ) {
      this.selectedCoverages = this.fb.array([]);
  }

  onBtnSaveClicked($event) {
    const cleanedData = this.checkissuedMedicalTest(this.consultationInfo);
    this.event.emit(cleanedData);
  }

  onBtnCloseClicked($event) {
    this.event.emit('Close');
  }

  ngOnInit() {
    if (this.selectedCoverages) {
      console.log('selected: ', this.selectedCoverages);
    } else {
      this.selectedCoverages = this.fb.array([]);
    }
    // this.patientAddFormGroup = this.patientService.getPatientAddFormGroup();
    this.consultationFormGroup = this.createConsultationPage();
    this.medicalCoverageSummaryFormGroup = this.createMedicalCoverageFormGroup();
    this.subscribeToValueChanges();

    if (!this.patientPlans) {
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

                // this.selectedPlans = this.coverages;
                this.medicalCoverageSummaryFormGroup.get('patientCoverages').patchValue(this.coverages);
                // console.log("THIS MEDICAL SUMMARY: ", this.medicalCoverageSummaryFormGroup);
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
    } else {
      this.medicalCoverageSummaryFormGroup.controls['patientCoverages'] = this.patientPlans;
    }
  }

  subscribeToValueChanges() {
    this.consultationFormGroup.valueChanges
      .pipe(
        debounceTime(50),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe(values => {
        console.log('CONSULTATION FORM:', values);
        this.visitDate = values.visitDate;
        this.time = moment(values.time).format('MM-DD-YYYY');
        this.purposeOfVisit = values.purposeOfVisit;
        this.remarks = values.remarks;
        this.preferredDoctor = values.preferredDoctor;
        this.consultationInfo.purposeOfVisit = values.purposeOfVisit;
        this.consultationInfo.priority = values.priority;
        this.consultationInfo.remarks = values.remarks;
        this.consultationInfo.preferredDoctor = values.preferredDoctor || undefined;
        console.log('consultation info:', this.consultationInfo);

        console.log(this.preferredDoctor);
      });

    this.medicalCoverageSummaryFormGroup
      .get('patientCoverages')
      .valueChanges.pipe(
        debounceTime(50),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe(values => {
        console.log('MEDICAL COVERAGE FORM:', values, this.consultationFormGroup);
        this.consultationInfo.attachedMedicalCoverages = values.attachedMedicalCoverages;
        // this.consultationInfo.attachedMedicalCoverages = values.attachedMedicalCoverages.map( x => { planId: x.planId});
      });
  }

  createConsultationPage(): FormGroup {
    console.log('returning Consultation Page Form');
    return this.fb.group({
      visitDate: new FormControl(),
      time: '', // '930',
      preferredDoctor: [''],
      purposeOfVisit: [''],
      priority: ['', Validators.required],
      remarks: '' // ['', Validators.required] // ,
    });
  }

  createMedicalCoverageFormGroup(): FormGroup {
    // console.log('returning MedicalCoverage Page Form');
    return this.fb.group({
      attachedMedicalCoverages: this.addMedicalCoverageForm(),
      patientCoverages: ''
    });
  }

  addMedicalCoverageForm() {
    const medicalCoverage = this.fb.group({
      coverageId: '',
      medicalCoverageId: '',
      planId: ''
    });

    return new FormArray([medicalCoverage]);
  }

  checkissuedMedicalTest(data) {
    // const attachedMedicalCoverages = data.attachedMedicalCoverages;
    const attachedMedicalCoverages = this.selectedCoverages.value;

    console.log('ATTACHED ARE: ', attachedMedicalCoverages);
    if (attachedMedicalCoverages) {
      const newAttachedMedicalCoverages = attachedMedicalCoverages.filter(
        value =>
          null !== value.coverageId &&
          value.coverageId !== '' &&
          null !== value.planId &&
          value.planId !== '' &&
          null !== value.medicalCoverageId &&
          value.medicalCoverageId !== ''
      );

      data.attachedMedicalCoverages = newAttachedMedicalCoverages;
    }

    return data;
  }

  disableConfirmBtn() {
    if (this.type === 'ATTACH_MEDICAL_COVERAGE') {
      return false;
    }

    if (!this.consultationFormGroup.valid) {
      return true;
    }
  }

  hideConsultationInfo() {
    if (this.type === 'ATTACH_MEDICAL_COVERAGE' || this.type === 'DISPLAY_MEDICAL_COVERAGE') {
      return true;
    }
    return false;
  }

  onSelect($event) {
    this.tabRefresh = $event.heading === 'Schedule Appointment' ? true : false;
  }

  hideTabs() {
    return this.hiddenTabs;
  }

  hideModal() {
    this.bsModalRef.hide();
  }
}
