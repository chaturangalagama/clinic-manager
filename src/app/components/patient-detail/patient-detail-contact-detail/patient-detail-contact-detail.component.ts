import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-patient-detail-contact-detail',
    templateUrl: './patient-detail-contact-detail.component.html',
    styleUrls: ['./patient-detail-contact-detail.component.scss']
})
export class PatientDetailContactDetailComponent implements OnInit {
    @Input() contactDetailFormGroup: FormGroup;

    constructor() {}

    ngOnInit() {}
}
