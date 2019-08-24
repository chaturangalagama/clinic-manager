import { ApiCmsManagementService } from './../../../services/api-cms-management.service';
import { PatientService } from './../../../services/patient.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Component({
    selector: 'app-patient-detail-company-info',
    templateUrl: './patient-detail-company-info.component.html',
    styleUrls: ['./patient-detail-company-info.component.scss']
})
export class PatientDetailCompanyInfoComponent implements OnInit {
    @Input() companyInfoFormGroup: FormGroup;

    constructor(private patientService: PatientService,
        private apiCmsManagementService: ApiCmsManagementService,
    ) { }

    ngOnInit() {
        this.subscribeOnChanges();
    }

    subscribeOnChanges(){
        this.companyInfoFormGroup
        .valueChanges
        .pipe(debounceTime(50), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
        .subscribe(values => {
          if (values.postCode) {
            this.companyInfoFormGroup
              .get('postCode')
              .setAsyncValidators(
                this.patientService.findAddress(
                  this.apiCmsManagementService,
                  this.companyInfoFormGroup.get('postCode'),
                  this.companyInfoFormGroup.get('line1'),
                  this.companyInfoFormGroup.get('line2'),
                  <FormGroup>this.companyInfoFormGroup
                )
              );
          } else {
            this.companyInfoFormGroup
              .get('postCode')
              .clearAsyncValidators();
          }
        });
    }
}
