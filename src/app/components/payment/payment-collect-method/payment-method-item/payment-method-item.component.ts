import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { IOption } from 'ng-select';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { mulitplierValidator } from '../../../../services/consultation-form.service';

@Component({
  selector: 'app-payment-method-item',
  templateUrl: './payment-method-item.component.html',
  styleUrls: ['./payment-method-item.component.scss']
})
export class PaymentMethodItemComponent implements OnInit {
  @Input() paymentMethodItemFormGroup: FormGroup;

  @Input() index: number;

  @Input() paymentsUpdate: BehaviorSubject<Array<IOption>> = new BehaviorSubject([]);

  @Output() onDeletePressed: EventEmitter<number> = new EventEmitter<number>();

  amount:FormControl;
  payments: Array<IOption>;
  disable = true;

  constructor() {}

  ngOnInit() {

    this.amount = new FormControl();
    this.paymentsUpdate.subscribe(data => {
      this.payments = [...data];
    });

    this.subscribeFormGroupValueChanges();
  }

  subscribeFormGroupValueChanges() {
    this.amount.valueChanges
    .pipe(distinctUntilChanged())
    .subscribe(value => {

      console.log("amount value:",value);
      console.log('value:  ', value * 100);

      this.paymentMethodItemFormGroup.get('amount').patchValue(value* 100);
    });

    this.paymentMethodItemFormGroup
      .valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(item => {
        this.setMandatoryField(item.payment, item.amount);
      });
  }

  setMandatoryField(payment: string, amount: number) {
    if (payment != 'CASH' && amount) {
      this.paymentMethodItemFormGroup.get('amount').setValidators(null);
      this.paymentMethodItemFormGroup.get('amount').markAsTouched();
      this.paymentMethodItemFormGroup.get('amount').updateValueAndValidity({ emitEvent: false });

      this.paymentMethodItemFormGroup.get('transactionId').setValidators([Validators.required]);
      this.paymentMethodItemFormGroup.get('transactionId').markAsTouched();
      this.paymentMethodItemFormGroup.get('transactionId').updateValueAndValidity({ emitEvent: false });

      if (payment === 'CHEQUE') {
        this.paymentMethodItemFormGroup.get('bank').setValidators([Validators.required]);
        this.paymentMethodItemFormGroup.get('bank').markAsTouched();
        this.paymentMethodItemFormGroup.get('bank').updateValueAndValidity({ emitEvent: false });
      }
    } else {
      this.paymentMethodItemFormGroup.get('amount').setValidators(mulitplierValidator(0.05));
      this.paymentMethodItemFormGroup.get('amount').markAsTouched();
      this.paymentMethodItemFormGroup.get('amount').updateValueAndValidity({ emitEvent: false });

      this.paymentMethodItemFormGroup.get('transactionId').setValidators(null);
      this.paymentMethodItemFormGroup.get('transactionId').markAsTouched();
      this.paymentMethodItemFormGroup.get('transactionId').updateValueAndValidity({ emitEvent: false });
    }
  }

  deletePressed() {
    const paymentMethod: IOption = this.payments.find(
      element => element.value === this.paymentMethodItemFormGroup.value.payment
    );
    if (paymentMethod) {
      paymentMethod.disabled = false;
      this.onDeletePressed.emit(this.index);
    }
  }
}
