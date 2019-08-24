import { BsModalRef } from 'ngx-bootstrap/modal';
import { DB_FULL_DATE_FORMAT } from './../../../../constants/app.constants';
import { FormGroup } from '@angular/forms';
import { ApiPatientVisitService } from './../../../../services/api-patient-visit.service';
import { StoreService } from './../../../../services/store.service';
import { AlertService } from './../../../../services/alert.service';
import { Component, OnInit, Input, Output, EventEmitter, Injector } from '@angular/core';
import * as moment from 'moment';
import { LoggerService } from '../../../../services/logger.service';
import { VitalService } from '../../../../services/vital.service';
@Component({
  selector: 'app-vital-sign',
  templateUrl: './vital-sign.component.html',
  styleUrls: ['./vital-sign.component.scss']
})
export class VitalSignComponent implements OnInit {
  @Input() vitalForm: FormGroup;
  isModal = false;
  patientId: string;
  bsModalRef: BsModalRef;

  weight = 0;
  height = 0;

  constructor(
    private alertService: AlertService,
    private store: StoreService,
    private apiPatientVisitService: ApiPatientVisitService,
    private vitalService: VitalService,
    private logger: LoggerService,
    private injector: Injector // public bsModalRef: BsModalRef
  ) {}

  ngOnInit() {
    if (this.vitalForm === undefined) {
      this.logger.info('Vital Form is undefined');
    } else {
      this.logger.info('Vital Form', this.vitalForm);
    }
    this.logWeightHeightChange();
    if (this.isModal) {
      this.bsModalRef = <BsModalRef>this.injector.get(BsModalRef);
    }

    if (this.isModal) {
      this.store.setPatientId(this.patientId);
      this.vitalService.getPastVitals();
    }
    this.vitalService.resetVitalData();
    this.vitalService.getObservableVitalData().subscribe(val => {
      if (val && val.length > 0) {
        // this.store.setPatientId('');
        const latestVital = val[val.length - 1];
        const takenTime = moment(latestVital.takenTime, DB_FULL_DATE_FORMAT);
        const todayTime = moment();
        const isTakenToday = todayTime.isSame(takenTime, 'day');
        console.log('Observable Vital Taken Data', latestVital);

        if (isTakenToday) {
          this.vitalForm.patchValue({
            weight: latestVital.weight,
            height: latestVital.height,
            bmi: latestVital.bmi,
            bp: latestVital.bp,
            pulse: latestVital.pulse,
            respiration: latestVital.respiration,
            temperature: latestVital.temperature,
            sa02: latestVital.sa02,
            others: latestVital.others
          });
        }
      }
    });
  }

  logWeightHeightChange() {
    const weightControl = this.vitalForm.get('weight');
    const heightControl = this.vitalForm.get('height');

    weightControl.valueChanges.subscribe((value: string) => {
      console.log('WEIGHT', value);
      this.weight = +value;
      this.calculateBmi(this.weight, this.height);
    });

    heightControl.valueChanges.subscribe((value: string) => {
      console.log('HEIGHT', value);
      this.height = +value;
      this.calculateBmi(this.weight, this.height);
    });
  }

  onUpdate() {
    const timeTaken = moment(new Date()).format(DB_FULL_DATE_FORMAT);
    const submitData = { ...this.vitalForm.value };
    submitData['takenTime'] = timeTaken;
    console.log('UPDATE', submitData);
    console.log('time taken', moment(new Date()).format(DB_FULL_DATE_FORMAT));

    let currentPatientId = this.store.getPatientId();
    if (this.isModal) {
      currentPatientId = this.patientId;
    }

    // this.apiPatientVisitService.addVital(currentPatientId, submitData).subscribe(
    //   data => {
    //     if (this.isModal) {
    //       this.bsModalRef.hide();
    //     }
    //     // this.vitalForm.reset();

    //     this.alertService.success('Vitals Updated');
    //     console.log('Submit Vital Status', data);
    //   },
    //   err => {
    //     console.log('Submit Vital Failed', err);
    //     this.alertService.error('Vitals Update Error', err);
    //   }
    // );
  }

  calculateBmi(weightInKg, heigthInCm) {
    console.log('BMI PARAM', weightInKg, heigthInCm);
    if (weightInKg > 0 && heigthInCm > 0) {
      const heigthInMeter = heigthInCm / 100;
      //Added toFixed by Donna, suggested by Shamil to round BMI to 1 d.p
      const bmi = (weightInKg / (heigthInMeter * heigthInMeter)).toFixed(1);
      this.vitalForm.get('bmi').patchValue(bmi);

      console.log('BMI', bmi);
      // return
    }
  }
}
