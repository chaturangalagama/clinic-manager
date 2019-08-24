import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-patient-add-other-patient-info',
  templateUrl: './patient-add-other-patient-info.component.html',
  styleUrls: ['./patient-add-other-patient-info.component.scss']
})
export class PatientAddOtherPatientInfoComponent implements OnInit {
  @Input() otherInfoFormGroup: FormGroup;

  constructor() {}

  ngOnInit() { }
}
