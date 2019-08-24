import { DisplayDollarPipe } from './../../../pipes/display-dollar.pipe';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-payment-collect-charge',
  templateUrl: './payment-collect-charge.component.html',
  styleUrls: ['./payment-collect-charge.component.scss']
})
export class PaymentCollectChargeComponent implements OnInit {
  @Input() collectChargeFormGroup: FormGroup;

  constructor() {}

  ngOnInit() {
    this.collectChargeFormGroup.valueChanges.pipe(debounceTime(50)).subscribe(values => {
      const charge =
        values.nets + values.creditCards + values.cheques === 0
          ? values.otherCharge + values.otherChargeGst - values.cashRoundAdjustedValue
          : values.otherCharge + values.otherChargeGst;

      const chargeBack = `$${(values.cash + values.nets + values.creditCards + values.cheques - charge).toFixed(2)}`;
      this.collectChargeFormGroup.patchValue(
        {
          chargeBack
        },
        { emitEvent: false }
      );
    });
  }
}
