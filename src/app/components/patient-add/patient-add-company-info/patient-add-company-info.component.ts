import { Component, OnInit, Input } from '@angular/core';
import { FormGroup} from '@angular/forms';

@Component({
  selector: 'app-patient-add-company-info',
  templateUrl: './patient-add-company-info.component.html',
  styleUrls: ['./patient-add-company-info.component.scss']
})
export class PatientAddCompanyInfoComponent implements OnInit {
  @Input() companyInfoFormGroup: FormGroup;

  constructor() { }

  ngOnInit() { }
}
