import { MedicalCoverageResponse } from './../../../objects/response/MedicalCoverageResponse';
import { ApiPatientInfoService } from './../../../services/api-patient-info.service';
import { StoreService } from './../../../services/store.service';
import { SelectedPlans } from './../../../objects/MedicalCoverage';
import { SelectedItem } from './../../../views/components/medical-coverage/assign-medical-coverage/assign-medical-coverage.component';

import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-patient-update-confirmation',
    templateUrl: './patient-update-confirmation.component.html'
})
export class PatientUpdateConfirmationComponent implements OnInit {
    @Input() confirmationFormGroup: FormGroup;

    bsModalRef: BsModalRef;
    medicalCoverageSummaryFormGroup: FormGroup;
    selectedItems: SelectedItem[] = [];
    public event: EventEmitter<any> = new EventEmitter();

    selectedPlans: SelectedPlans[];
    coverages: MedicalCoverageResponse;

    indexesOfCheckedPlans = [];
    title: string;

    constructor(
        private modalService: BsModalService,
        private fb: FormBuilder,
        private store: StoreService,
        private apiPatientInfoService: ApiPatientInfoService
    ) { }

    onBtnSaveClicked($event) {
        this.selectedPlans.map((value, index) => {
            if (value.isSelected) {
                console.log('Plan ' + index + 'selected!');
            }
        });

        this.event.emit(this.selectedPlans);
    }

    ngOnInit() {
        this.medicalCoverageSummaryFormGroup = this.createMedicalCoverageFormGroup();
        this.subscribeToValueChanges();


        console.log("PATIENT-UPDATE-CONFIRMATION: ngOnInit() this.selectedPlans: ", this.selectedPlans);

        console.log("PATIENT-UPDATE-CONFIRMATION: ngOnInit() this.medicalCoverageSummaryFormGroup: ", this.medicalCoverageSummaryFormGroup);

        if (!this.selectedPlans) {
            this.apiPatientInfoService
                .searchBy('systemuserid', this.store.getPatientId())
                .subscribe(
                    res => {
                        const patientInfo = res.payload;

                        this.apiPatientInfoService
                            .searchAssignedPoliciesByUserId(patientInfo['userId'])
                            .subscribe(
                                value => {
                                    if (value.payload) {
                                        this.coverages = new MedicalCoverageResponse(
                                            value.payload.INSURANCE,
                                            value.payload.CORPORATE,
                                            value.payload.CHAS,
                                            value.payload.MEDISAVE
                                        );
                                        console.log('MEDICAL COVERAGES', this.coverages);
                                        // this.selectedPlans = this.coverages;
                                        this.medicalCoverageSummaryFormGroup
                                            .get('patientCoverages')
                                            .patchValue(this.coverages);
                                    }
                                },
                                err => console.log(err)
                            );
                    },
                    err => console.log(err)
                );
        }
    }

    subscribeToValueChanges() {
        this.medicalCoverageSummaryFormGroup.valueChanges
            .pipe(debounceTime(50), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
            .subscribe(values => {
                console.log('MEDICAL COVERAGE FORM:', values);
            });
    }

    createMedicalCoverageFormGroup(): FormGroup {
        return this.fb.group({
            attachedMedicalCoverages: this.addMedicalCoverageForm(),
            patientCoverages: ''
        });
    }

    addMedicalCoverageForm() {
        const medicalCoverage = this.fb.group({
            medicalCoverageId: '',
            planId: ''
        });

        return new FormArray([medicalCoverage]);
    }
}
