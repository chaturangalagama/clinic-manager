import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment';

import { PatientHistoryDetailEditCertificateItemComponent } from './patient-history-detail-edit-certificate-item.component';
import { DISPLAY_DATE_FORMAT } from '../../../../constants/app.constants';

@Component({
  selector: 'app-patient-history-detail-edit-certificate',
  templateUrl: './patient-history-detail-edit-certificate.component.html',
  styleUrls: ['./patient-history-detail-edit-certificate.component.scss']
})
export class PatientHistoryDetailEditCertificateComponent implements OnInit {
  @Input()
  certificateArray: FormArray;
  title: string;

  constructor(private fb: FormBuilder, public bsModalRef: BsModalRef) {}

  ngOnInit() {}

  addItem() {
    this.certificateArray.push(
      PatientHistoryDetailEditCertificateItemComponent.buildItem(
        '',
        moment(new Date()).format(DISPLAY_DATE_FORMAT),
        moment(new Date()).format(DISPLAY_DATE_FORMAT),
        1,
        '',
        '',
        ''
      )
    );
  }
}
