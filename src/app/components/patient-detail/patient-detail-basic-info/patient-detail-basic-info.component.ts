import { ApiCmsManagementService } from './../../../services/api-cms-management.service';
import { ApiPatientInfoService } from './../../../services/api-patient-info.service';
import { PatientService } from './../../../services/patient.service';
import { filter, debounceTime, map, distinctUntilChanged } from 'rxjs/operators';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-patient-detail-basic-info',
  templateUrl: './patient-detail-basic-info.component.html',
  styleUrls: ['./patient-detail-basic-info.component.scss']
})
export class PatientDetailBasicInfoComponent implements OnInit {
  @Input() basicInfoFormGroup: FormGroup;
  @Input() patientInfo;

  maxDate: Date;
  storedPatientID;
  storedPatientIDType;
  storedPatientPostalCode;

  constructor(
    private patientService: PatientService,
    private apiPatientInfoService: ApiPatientInfoService,
    private apiCmsManagementService: ApiCmsManagementService
  ) {}

  ngOnInit() {
    this.maxDate = new Date();

    this.subscribeValueChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.patientInfo && changes.patientInfo.currentValue) {
      console.log('changes basic info: ', changes);
      console.log('patientInfo basic info: ', this.patientInfo);
      this.storedPatientID = this.patientInfo.userId.number;
      this.storedPatientIDType = this.patientInfo.userId.idType;
      this.storedPatientPostalCode = this.patientInfo.address.postalCode;
    }
  }

  resetIDControlErrors($event) {
    console.log('reset ID');
  }

  subscribeValueChanges() {
    const fullIdArrayFormGroup = this.basicInfoFormGroup.get('fullId');

    // Mark secondary as touched
    this.basicInfoFormGroup.get('primary').markAsTouched();
    this.basicInfoFormGroup.get('secondary').markAsTouched();

    // Setting Validators for ID
    fullIdArrayFormGroup.valueChanges
      .pipe(
        filter(val => {
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
          const id = val.id ? val.id.toUpperCase() : '';
          const idType = val.idType ? val.idType.toUpperCase() : '';
          if (
            !(
              id === this.storedPatientID.toUpperCase() &&
              idType === this.storedPatientIDType.toUpperCase()
            )
          ) {
            fullIdArrayFormGroup
              .get('id')
              .setAsyncValidators([
                this.patientService.checkWhetherUserExists(
                  this.apiPatientInfoService,
                  fullIdArrayFormGroup.get('idType'),
                  'idType'
                ),
                this.patientService.validateIdentification(
                  this.apiCmsManagementService,
                  fullIdArrayFormGroup.get('idType'),
                  'idType'
                )
              ]);
            console.log('finish setting validators');
          }

          if (
            (val.id.toUpperCase() === this.storedPatientID.toUpperCase() &&
              val.idType.toUpperCase() === 'NRIC_PINK' &&
              this.storedPatientIDType.toUpperCase() === 'NRIC_BLUE') ||
            (val.id.toUpperCase() === this.storedPatientID.toUpperCase() &&
              val.idType.toUpperCase() === 'NRIC_BLUE' &&
              this.storedPatientIDType.toUpperCase() === 'NRIC_PINK')
          ) {
            fullIdArrayFormGroup
              .get('id')
              .setAsyncValidators([
                this.patientService.checkWhetherUserExists(
                  this.apiPatientInfoService,
                  fullIdArrayFormGroup.get('idType'),
                  'idType'
                ),
                this.patientService.validateIdentification(
                  this.apiCmsManagementService,
                  fullIdArrayFormGroup.get('idType'),
                  'idType'
                )
              ]);
          }

          val.id = val.id.toUpperCase();
          fullIdArrayFormGroup.patchValue(val, { emitEvent: false });
          return val;
        }),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe(values => {
        fullIdArrayFormGroup.get('id').clearAsyncValidators();

        const countryFC = this.basicInfoFormGroup.get('country');

        if (values.idType === 'PASSPORT') {
          if (countryFC.value === 'SINGAPORE') {
            //By default, country is set to Singapore, clear country when passport is selected
            // countryFC.reset();
            countryFC.setValidators(Validators.required);
            countryFC.markAsTouched();
            countryFC.updateValueAndValidity();
          }
        } else {
          countryFC.patchValue('SINGAPORE');
          countryFC.clearValidators();
          countryFC.updateValueAndValidity();
        }
      });

    this.basicInfoFormGroup.valueChanges
      .pipe(
        debounceTime(50),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe(values => {
        if (values.postCode && values.postCode !== this.storedPatientPostalCode) {
          this.storedPatientPostalCode = values.postCode;

          this.basicInfoFormGroup
            .get('postCode')
            .setAsyncValidators(
              this.patientService.findAddress(
                this.apiCmsManagementService,
                this.basicInfoFormGroup.get('postCode'),
                this.basicInfoFormGroup.get('line1'),
                this.basicInfoFormGroup.get('line2'),
                <FormGroup>this.basicInfoFormGroup
              )
            );
        } else {
          this.basicInfoFormGroup.get('postCode').clearAsyncValidators();
        }
      });
    console.log('detail form: ', this.basicInfoFormGroup);
  }
}
