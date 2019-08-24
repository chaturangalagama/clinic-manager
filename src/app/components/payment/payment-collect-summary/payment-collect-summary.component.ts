import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-payment-collect-summary',
  templateUrl: './payment-collect-summary.component.html',
  styleUrls: ['./payment-collect-summary.component.scss']
})
export class PaymentCollectSummaryComponent implements OnInit {
  @Input() paymentFormGroup: FormGroup;

  payCashOnly = true;

  cash: number = 0;
  creditCard: number = 0;
  nets: number = 0;
  cheque: number = 0;

  chargeBackCentNotValid = false;

  constructor() {}

  ngOnInit() {
    this.paymentFormGroup
      .get('paymentArray')
      .valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(payments => {
        this.updateData(payments);
      });

    this.updateData(this.paymentFormGroup.get('paymentArray').value);
  }

  updateData(payments: Array<any>) {
    const payingMethod = payments.filter(item => item.amount > 0);
    this.payCashOnly = payingMethod.length === 1 && payingMethod[0].payment === 'CASH';

    this.cash = (payments.find(item => item.payment === 'CASH') || { amount: 0 }).amount || 0;
    this.creditCard = payments
      .filter(item => item.payment !== 'CASH' && item.payment !== 'NETS' && item.payment !== 'CHEQUE')
      .reduce((sum, item) => (sum += item.amount), 0);

    this.nets = payments.filter(item => item.payment === 'NETS').reduce((sum, item) => (sum += item.amount), 0);
    this.cheque = payments.filter(item => item.payment === 'CHEQUE').reduce((sum, item) => (sum += item.amount), 0);

    let sum = this.paymentFormGroup.value.otherCharge + this.paymentFormGroup.value.otherChargeGst;
    if (this.payCashOnly) {
      sum -= this.paymentFormGroup.value.cashRoundAdjustedValue;
    }

    let chargeBack = this.cash + this.creditCard + this.nets + this.cheque - sum;
    chargeBack = Math.max(chargeBack, 0)
    this.chargeBackCentNotValid = chargeBack.toFixed(2).slice(-1) !== '0' && chargeBack.toFixed(2).slice(-1) !== '5';

    this.paymentFormGroup.get('chargeBack').patchValue(chargeBack, { emitEvent: false });
  }
}
