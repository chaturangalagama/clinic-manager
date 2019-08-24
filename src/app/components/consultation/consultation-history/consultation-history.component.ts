import { DispatchDrugDetail } from './../../../objects/request/DrugDispatch';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-consultation-history',
  templateUrl: './consultation-history.component.html',
  styleUrls: ['./consultation-history.component.scss']
})
export class ConsultationHistoryComponent implements OnInit {
  @Output() copiedPrescription = new EventEmitter<DispatchDrugDetail[]>();

  constructor() {}

  ngOnInit() {}

  copyPrescription(data) {
    console.log('incoming prescription--2', data);
    this.copiedPrescription.emit(data);
  }
}
