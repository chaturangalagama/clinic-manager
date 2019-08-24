import { FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-consultation-follow-up',
  templateUrl: './consultation-follow-up.component.html',
  styleUrls: ['./consultation-follow-up.component.scss']
})
export class ConsultationFollowUpComponent implements OnInit {
  @Input() item: FormGroup;
  minDate: Date;
  constructor() {}

  ngOnInit() {
    this.minDate = new Date();
    this.subscribeOnChange();
  }

  subscribeOnChange() {
    this.item
      .get('followupDate')
      .valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(data => {
        if (data) {
          this.setMandatoryFields();
          // to make sure date is valid, else will reset/clear the control
          if (data.toString().toLowerCase() === 'invalid date') {
            this.item.get('followupDate').reset();
          }
        } else {
          this.unsetMandatoryFields();
        }
      });
    this.item
      .get('remarks')
      .valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(data => {
        if (data) {
          this.setMandatoryFields();
        } else {
          this.unsetMandatoryFields();
        }
      });
  }

  setMandatoryFields() {
    this.item.get('followupDate').setValidators([Validators.required]);
    this.item.get('followupDate').markAsTouched();
    this.item.get('followupDate').updateValueAndValidity();

    this.item.get('remarks').setValidators([Validators.required]);
    this.item.get('remarks').markAsTouched();
    this.item.get('remarks').updateValueAndValidity();
  }

  unsetMandatoryFields() {
    const followupDateControl = this.item.get('followupDate');
    const remarksControl = this.item.get('remarks');
    // Make sure followup date and remarks are empty
    if (!followupDateControl.value && !remarksControl.value) {
      followupDateControl.setValidators(null);
      followupDateControl.markAsTouched();
      followupDateControl.updateValueAndValidity();

      remarksControl.setValidators(null);
      remarksControl.markAsTouched();
      remarksControl.updateValueAndValidity();
    }
  }
}
