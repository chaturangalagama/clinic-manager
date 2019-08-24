import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IOption } from 'ng-select';

@Component({
  selector: 'app-payment-selection',
  templateUrl: './payment-selection.component.html',
  styleUrls: ['./payment-selection.component.scss']
})
export class PaymentSelectionComponent implements OnInit {
  @Input()
  formGroup: FormGroup;

  title: string;

  payments: Array<IOption> = [
    { value: 'NETS', label: 'NETS' },
    { value: 'VISA', label: 'VISA' },
    { value: 'MASTER_CARD', label: 'MASTER CARD' },
    { value: 'AMERICAN_EXPRESS', label: 'AMERICAN EXPRESS' },
    { value: 'JCB', label: 'JCB' },
    { value: 'OTHER_CREDIT_CARD', label: 'OTHER CREDIT CARD' }
  ];

  constructor(public fb: FormBuilder, public bsModalRef: BsModalRef) {}

  ngOnInit() {}

  onSave() {
    this.bsModalRef.hide();
  }

  onBtnAdd(form: FormGroup) {
    const paymentArray = form.get('paymentArray') as FormArray;
    paymentArray.push(
      this.fb.group({
        payment: '',
        amount: 0,
        transactionId: ''
      })
    );
  }

  onDelete(form: FormGroup, index: number) {
    const formArray = form.parent as FormArray;
    formArray.removeAt(index);
  }
}
