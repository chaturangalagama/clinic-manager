import { filter, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ApiCmsManagementService } from './../../../services/api-cms-management.service';
import { ApiPatientInfoService} from './../../../services/api-patient-info.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PatientService } from '../../../services/patient.service';

@Component({
  selector: 'app-patient-add-patient-info',
  templateUrl: './patient-add-patient-info.component.html',
  styleUrls: ['./patient-add-patient-info.component.scss']
})
export class PatientAddPatientInfoComponent implements OnInit {
  @Input() basicInfoFormGroup: FormGroup;
  phone_number = '2342342';
  maxDate: Date;

  constructor(
    private patientService: PatientService,
    private apiPatientInfoService: ApiPatientInfoService,
    private apiCmsManagementService: ApiCmsManagementService
  ) {}

  ngOnInit() {
    this.maxDate = new Date();

    this.subscribeValueChanges();

  }

  subscribeValueChanges(){
    const fullIdArrayFormGroup = this.basicInfoFormGroup.get('fullId');

    fullIdArrayFormGroup.valueChanges
      .pipe(filter(val => {
        
        // Filter and remove '/'
        if (val.id.match(/[^a-zA-Z0-9 ]/g)) {
          val.id = val.id.replace(/[^a-zA-Z0-9 ]/g, '');
          fullIdArrayFormGroup.get('id').setValue(val.id);
        }
        return val;
      }),
      debounceTime(500),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      map(val => {
        fullIdArrayFormGroup.get('id').markAsTouched();

        if (val.id || val.idType) {
          fullIdArrayFormGroup
            .get('id')
            .setAsyncValidators([
              this.patientService.checkWhetherUserExists(
                this.apiPatientInfoService, fullIdArrayFormGroup.get('idType'),
                'idType'),
              this.patientService.validateIdentification(
                this.apiCmsManagementService,
                fullIdArrayFormGroup.get('idType'),
                'idType'
              )
            ]);
        }
        val.id = val.id.toUpperCase();
        fullIdArrayFormGroup.patchValue(val);
        return val;
      }), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(values => {
        fullIdArrayFormGroup.get('id').clearAsyncValidators();
      });

  }

  resetIDControlErrors($event) {
    console.log('reset ID');
  }

  onInput($event) {
    console.log('EVENT: ', $event);
  }
}
