import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { AlertService } from '../../../../services/alert.service';
import { ApiCmsManagementService } from '../../../../services/api-cms-management.service';
import { StoreService } from '../../../../services/store.service';

@Component({
  selector: 'app-patient-history-detail-edit-note',
  templateUrl: './patient-history-detail-edit-note.component.html',
  styleUrls: ['./patient-history-detail-edit-note.component.scss']
})
export class PatientHistoryDetailEditNoteComponent implements OnInit {
  @Input()
  consultationNotes: FormControl;

  title: string;
  templates: {};
  template: any;
  content: string;
  isAppend = true;

  constructor(
    private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    private store: StoreService,
    private apiCmsManagementService: ApiCmsManagementService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.templates = this.store.getTemplates();
    console.log('Templates', this.templates);
  }

  onTemplateChange(event) {
    if (event) {
      this.apiCmsManagementService
        .loadTemplate(event.type, event.id, this.store.getUser().context['cms-user-id'], this.store.getPatientId())
        .subscribe(
          res => {
            if (res.payload) {
              if (this.isAppend) {
                this.consultationNotes.patchValue(this.consultationNotes.value + '<br>' + res.payload);
              } else {
                this.consultationNotes.patchValue(res.payload);
              }
            }
          },
          err => {
            this.alertService.error(JSON.stringify(err));
          }
        );
    } else {
      this.consultationNotes.patchValue('');
    }
  }
}
