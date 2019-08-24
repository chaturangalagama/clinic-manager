import { billTemplate } from './../../../views/templates/bill';
import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ApiCmsManagementService } from '../../../services/api-cms-management.service';
import { PrintTemplateService } from './../../../services/print-template.service';

@Component({
  selector: 'app-payment-print-charge',
  templateUrl: './payment-print-charge.component.html',
  styleUrls: ['./payment-print-charge.component.scss']
})
export class PaymentPrintChargeComponent implements OnInit {
  @Input() collectFormGroup: FormGroup;
  @Input() patientInfo;
  @Input() paymentInfo;
  printFormGroup;

  constructor(
    private apiCmsManagementService: ApiCmsManagementService,
    private printTemplateService: PrintTemplateService
  ) {}

  ngOnInit() {
    this.printFormGroup = this.collectFormGroup.get('printFormGroup');
    console.log('patient INFO :', this.patientInfo);
  }

  onBtnPrintClicked() {
    this.apiCmsManagementService
      .updateLabel('5ae03f77dbea1b12fe7d6686', 'DRUG_LABEL', JSON.stringify(billTemplate))
      .subscribe(
        res => {
          console.log(res);
        },
        err => console.log(err)
      );
  }

  onBtnPrintDraftBillReceipt() { }

  onBtnPrintPOSClicked() {
    console.log('Print POS');
  }

  onBtnClosePOSClicked() {
    console.log('Close POS');
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 113:
        this.onBtnPrintDraftBillReceipt();
        break;
    }
  }
}
