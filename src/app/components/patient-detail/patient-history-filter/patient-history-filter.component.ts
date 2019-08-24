import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-patient-history-filter',
    templateUrl: './patient-history-filter.component.html',
    styleUrls: ['./patient-history-filter.component.scss']
})
export class PatientHistoryFilterComponent implements OnInit {
    @Input() formGroup: FormGroup;

    constructor() {}

    ngOnInit() {}

    onBtnSubmitClicked() { }
}
