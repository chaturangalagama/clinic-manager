import { ConsultationFormService } from './../../../services/consultation-form.service';
import { FormArray } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-consultation-referral',
  templateUrl: './consultation-referral.component.html',
  styleUrls: ['./consultation-referral.component.scss']
})
export class ConsultationReferralComponent implements OnInit {
  @Input() itemsFormArray: FormArray;
  minDate = new Date(2017, 5, 10);
  maxDate = new Date(2018, 9, 15);

  bsValue: Date = new Date();
  bsRangeValue: any = [new Date(2017, 7, 4), new Date(2017, 7, 20)];

  codes: string[];
  constructor(private consultationFormService: ConsultationFormService) {}

  ngOnInit() {
    console.log("REFERRRAL: ", this.itemsFormArray);
  }

  onBtnAddClicked() {
    this.consultationFormService.initPatientReferral();
  }

  onDelete(index) {
    console.log('delete index', index);
    this.itemsFormArray.removeAt(index);
  }
}
