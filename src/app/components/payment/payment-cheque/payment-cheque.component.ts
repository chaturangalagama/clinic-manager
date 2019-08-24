import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { IOption } from 'ng-select';

@Component({
  selector: 'app-payment-cheque',
  templateUrl: './payment-cheque.component.html',
  styleUrls: ['./payment-cheque.component.scss']
})
export class PaymentChequeComponent implements OnInit {
  @Input() chequeFormGroup: FormGroup;

  payments: Array<IOption> = [{ value: 'CHEQUE', label: 'CHEQUE' }, { value: 'GIRO', label: 'GIRO' }];

  constructor(public fb: FormBuilder) {}

  ngOnInit() {}

  onBtnAdd(form: FormGroup) {
    const chequeArray = form.get('chequeArray') as FormArray;
    chequeArray.push(
      this.fb.group({
        payment: 'CHEQUE',
        amount: 0,
        bank: '',
        chequeNo: ''
      })
    );
  }

  onDelete(form: FormGroup, index: number) {
    const formArray = form.parent as FormArray;
    formArray.removeAt(index);
  }
}
