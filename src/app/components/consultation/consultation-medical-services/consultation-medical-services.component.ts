import { FormArray } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-consultation-medical-services',
    templateUrl: './consultation-medical-services.component.html',
    styleUrls: ['./consultation-medical-services.component.scss']
})
export class ConsultationMedicalServicesComponent implements OnInit {
    @Input() public mcItemsFormArray: FormArray;
    constructor() {}

    ngOnInit() {}

    onButtonAddClicked() {}
}
