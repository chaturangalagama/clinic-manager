import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-patient-detail-header',
    templateUrl: './patient-detail-header.component.html',
    styleUrls: ['./patient-detail-header.component.scss']
})
export class PatientDetailHeaderComponent implements OnInit {
    @Input() headerFormGroup: FormGroup;

    constructor() {}

    ngOnInit() {}
}
