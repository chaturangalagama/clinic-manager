import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { ApiCaseManagerService } from '../../../services/api-case-manager.service';
import { StoreService } from '../../../services/store.service';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import moment = require('moment');
import { BsModalRef } from 'ngx-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-case-manager-new-payment',
  templateUrl: './case-manager-new-payment.component.html',
  styleUrls: ['./case-manager-new-payment.component.scss']
})
export class CaseManagerNewPaymentComponent implements OnInit {

  invoices: any;
  rows = [];
  paymentTypes = [];
  title: string;
  public event: EventEmitter<any> = new EventEmitter();
  mainFormGroup: FormGroup;

  columns = [
    { name: 'Mode', flexGrow: 1 },
    { name: 'Amount', flexGrow: 1 },
    { name: 'Date', flexGrow: 1 },
    { name: 'Reference', flexGrow: 1 }
  ];

  constructor(
    private alertService: AlertService,
    private bsModalRef: BsModalRef,
    private apiCaseManagerService: ApiCaseManagerService,
  ) { 
  }

  ngOnInit() {
    this.populateData();
    this.mainFormGroup = new FormGroup({
      paymentType: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      reference: new FormControl('', Validators.required)
    });
  }

  populateData() {
    this.rows = this.invoices.map((payload) => {
      const row = {
        paymentMode: payload.paymentMode,
        payableAmount: payload.payableAmount,
        dateTime: moment(moment(payload.invoiceTime, 'DD-MM-YYYYT00:00:00')).format('DD-MM-YYYY'),
        reference: payload.reference
      };
      return row;
    });
    console.log('Invoice List', this.rows);
  }

  cancelModal() {
    this.bsModalRef.hide();
  }

  recordPayment() {
    console.log("New Payment - ",this.mainFormGroup.value);
    this.mainFormGroup.value['amount'] = this.mainFormGroup.value['amount']*100;
    this.event.emit(this.mainFormGroup.value);
  }
}
