import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-payment-confirm',
  templateUrl: './payment-confirm.component.html',
  styleUrls: ['./payment-confirm.component.scss']
})
export class PaymentConfirmComponent implements OnInit {
  @Output()
  printClicked = new EventEmitter<boolean>();
  @Output()
  nextClicked = new EventEmitter<boolean>();

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {}

  onBtnPrint() {
    this.printClicked.emit(true);
  }

  onBtnNext() {
    this.nextClicked.emit(true);
  }
}
