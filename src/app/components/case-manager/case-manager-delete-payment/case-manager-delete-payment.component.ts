import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { StoreService } from '../../../services/store.service';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-case-manager-delete-payment',
  templateUrl: './case-manager-delete-payment.component.html',
  styleUrls: ['./case-manager-delete-payment.component.scss']
})
export class CaseManagerDeletePaymentComponent implements OnInit {
  rows = [];
  fromDate: string;
  startDate: Date;
  patientId: string;
  selected = [];
  visitIds = [];
  title: string;
  public event: EventEmitter<any> = new EventEmitter();
  mainFormGroup: FormGroup;
  message: string;

  columns = [
    { name: 'Mode', flexGrow: 1 },
    { name: 'Amount', flexGrow: 1 },
    { name: 'Date/Time', flexGrow: 1 },
    { name: 'Reference', flexGrow: 1 }
  ];
  visitResponse: any;

  constructor(
    private bsModalRef: BsModalRef
  ) { }

  ngOnInit() {
    this.mainFormGroup = new FormGroup({
      textInput: new FormControl('', Validators.required)
    });
  }

  cancelModal() {
    this.bsModalRef.hide();
  }

  onDeletePaymentConfirm(){
    this.event.emit(this.mainFormGroup.value.textInput);
  }
}
