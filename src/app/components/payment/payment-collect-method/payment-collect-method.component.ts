import { DisplayDollarPipe } from './../../../pipes/display-dollar.pipe';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { PaymentService } from '../../../services/payment.service';
import { IOption } from 'ng-select';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
@Component({
  selector: 'app-payment-collect-method',
  templateUrl: './payment-collect-method.component.html',
  styleUrls: ['./payment-collect-method.component.scss']
})
export class PaymentCollectMethodComponent implements OnInit {
  @Input() paymentFormGroup: FormGroup;

  paymentMethodSelections: Array<IOption>;
  paymentMethodSelectionsUpdate: BehaviorSubject<Array<IOption>>;

  multiplePayment: Boolean = false;

  constructor(private paymentService: PaymentService) {
    this.paymentMethodSelections = [
      { value: 'CASH', label: 'CASH', disabled: true },
      { value: 'NETS', label: 'NETS' },
      { value: 'VISA', label: 'VISA' },
      { value: 'MASTER_CARD', label: 'MASTER CARD' },
      { value: 'AMERICAN_EXPRESS', label: 'AMERICAN EXPRESS' },
      { value: 'JCB', label: 'JCB' },
      { value: 'OTHER_CREDIT_CARD', label: 'OTHER CREDIT CARD' },
      { value: 'CHEQUE', label: 'CHEQUE' }
    ];

    this.paymentMethodSelectionsUpdate = new BehaviorSubject(this.paymentMethodSelections);
  }

  ngOnInit() {
    this.subscribeArrayItemChange();
  }

  convertToCents(payment){
    return payment * 100;
  }

  subscribeArrayItemChange() {
    this.paymentFormGroup
      .get('paymentArray')
      .valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(data => {
        console.log("paymentArray: ",this.paymentFormGroup.get('paymentArray').value);
        const totalSum = this.paymentFormGroup.value.otherCharge + this.paymentFormGroup.value.otherChargeGst;
        const cashSum = totalSum - this.paymentFormGroup.value.cashRoundAdjustedValue;

        const payMethod = data.filter(item => item.amount > 0);
        this.multiplePayment = payMethod.length > 1;

        const totalOutstanding = totalSum - payMethod.reduce((sum, item) => (sum += item.amount), 0);
        const cashOutstanding = cashSum - payMethod.reduce((sum, item) => (sum += item.amount), 0);

        let outstanding: number = 0;

        if (payMethod.length === 1 && payMethod[0].payment === 'CASH') {
          outstanding = cashOutstanding;
        } else {
          outstanding = totalOutstanding;
        }

        this.paymentFormGroup.get('totalOutstanding').patchValue(Math.max(0, totalOutstanding).toFixed(0));
        this.paymentFormGroup.get('cashOutstanding').patchValue(Math.max(0, cashOutstanding).toFixed(0));
        this.paymentFormGroup.get('outstanding').patchValue(outstanding.toFixed(0));
      });
  }

  onMethodAdd() {
    (this.paymentFormGroup.get('paymentArray') as FormArray).push(this.paymentService.createPaymentMethodArrayItem());
  }

  onMethodDelete(index: number) {
    const formArray = this.paymentFormGroup.get('paymentArray') as FormArray;
    formArray.removeAt(index);
  }
}
