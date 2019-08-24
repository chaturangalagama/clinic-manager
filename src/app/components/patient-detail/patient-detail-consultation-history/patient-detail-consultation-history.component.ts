import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-patient-detail-consultation-history',
    templateUrl: './patient-detail-consultation-history.component.html',
    styleUrls: ['./patient-detail-consultation-history.component.scss']
})
export class PatientDetailConsultationHistoryComponent implements OnInit {
    @Input() consultationFormGroup: FormGroup;

    constructor() {}

    ngOnInit() {}
}
