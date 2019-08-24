import { PrintTemplateService } from './../../../services/print-template.service';
import { Component, OnInit, Input } from '@angular/core';

import { StoreService } from '../../../services/store.service';
import { AlertService } from '../../../services/alert.service';
import { ApiCmsManagementService } from '../../../services/api-cms-management.service';

@Component({
  selector: 'app-patient-detail-print',
  templateUrl: './patient-detail-print.component.html',
  styleUrls: ['./patient-detail-print.component.scss']
})
export class PatientDetailPrintComponent implements OnInit {
  @Input() patientInfo;

  constructor(
    private printTemplateService: PrintTemplateService
  ) {}

  ngOnInit() {}

  printTemplate(template: string) {
    const w = window.open();
    w.document.open();
    w.document.write(template);
    w.document.close();
    console.log('document closed');
    w.onload = () => {
      console.log('window loaded');
      w.window.print();
    };
    w.onafterprint = () => {
      w.close();
    };
  }

  onBtnPrintPatientLabelClicked() {
    this.printTemplateService.onBtnPrintPatientLabelClicked(this.patientInfo);
  }
}
