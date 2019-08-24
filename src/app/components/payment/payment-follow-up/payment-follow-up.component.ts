import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-payment-follow-up',
  templateUrl: './payment-follow-up.component.html',
  styleUrls: ['./payment-follow-up.component.scss']
})
export class PaymentFollowUpComponent implements OnInit {
  @Input() consultationInfo;
  @Input() followUpFormGroup;
  minDate: Date;

  constructor() {}

  ngOnInit() {
    this.minDate = new Date();

    console.log('followupformgroup: ', this.followUpFormGroup);
  }

  subscribeValueChanges() {}
}
