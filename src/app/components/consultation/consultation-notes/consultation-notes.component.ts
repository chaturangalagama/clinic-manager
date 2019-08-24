import { AlertService } from './../../../services/alert.service';
import { ApiCmsManagementService } from './../../../services/api-cms-management.service';
import { StoreService } from './../../../services/store.service';
import { FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-consultation-notes',
  templateUrl: './consultation-notes.component.html',
  styleUrls: ['./consultation-notes.component.scss']
})
export class ConsultationNotesComponent implements OnInit {
  @Input() consultationNotes: FormControl;

  templates: {};
  template: any;
  content: string;
  isAppend = true;
  ckeConfig: any;

  constructor(
    private store: StoreService,
    private apiCmsManagementService: ApiCmsManagementService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.templates = this.store.getTemplates();
    console.log('Templates', this.templates);

    this.ckeConfig = {
      allowedContent: true,
      extraPlugins: 'divarea'
    };
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
      // this.consultationNotes.patchValue('');
    }
  }

  onBtnAddClicked() {
    
  }
}
