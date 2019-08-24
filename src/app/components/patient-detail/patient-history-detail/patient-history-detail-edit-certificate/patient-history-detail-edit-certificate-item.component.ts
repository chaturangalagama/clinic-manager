import { DB_FULL_DATE_FORMAT } from './../../../../constants/app.constants';
import { FormGroup, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { Component, OnInit, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { distinctUntilChanged, debounceTime, filter } from 'rxjs/operators';
import * as moment from 'moment';

import {
  MC_REASONS_DROPDOWN,
  DISPLAY_DATE_FORMAT,
  MC_HALFDAY_OPTIONS
} from '../../../../constants/app.constants';
import { LoggerService } from '../../../../services/logger.service';

@Component({
  selector: 'app-patient-history-detail-edit-certificate-item',
  templateUrl: './patient-history-detail-edit-certificate-item.component.html'
})
export class PatientHistoryDetailEditCertificateItemComponent implements OnInit, OnChanges {
  @Input() public index: number;
  @Input() public medicalCertificateItem: FormGroup;
  @Output() public removed: EventEmitter<number> = new EventEmitter<number>();

  minDate = new Date();
  maxDate = new Date(2018, 9, 15);

  bsValue: Date = new Date();
  bsRangeValue: any = [new Date(2017, 7, 4), new Date()];

  reasons_row = [
    'UNFIT FOR DUTY',
    'UNFIT FOR ICT',
    'UNFIT FOR SCHOOL',
    'EXCUSED SHOES/SOCKS',
    'UNFIT FOR PE',
    'EXCUSED LOWER LIMB ACTIVITIES',
    'LIGHT DUTIES ONLY',
    'FIT FOR DUTY',
    'UNFIT FOR IPPT',
    'FIT FOR SCHOOL',
    'UNFIT FOR REMEDIAL TRAINING',
    'OTHERS'
  ];

  reasons = [];
  halfDayOptions = [];
  isOtherShown = false;
  otherReason = '';

  static buildItem(
    purpose: string,
    startDate: string,
    endDate: string,
    numberOfDays: number,
    otherReason: string,
    str: string,
    remark: string
  ) {
    return new FormGroup({
      purpose: new FormControl(purpose),
      startDate: new FormControl(startDate),
      endDate: new FormControl(endDate),
      numberOfDays: new FormControl(numberOfDays),
      otherReason: new FormControl(otherReason),
      str: new FormControl(str),
      remark: new FormControl(remark)
      // halfDayOption: new FormControl(halfDay)
    });
  }

  constructor(private logger: LoggerService) {
    this.generateReasonsDropdown();
  }

  ngOnInit() {
    console.log('medical certificate item: ', this.medicalCertificateItem);

    const purposeFC = this.medicalCertificateItem.get('purpose');
    const startDateFC = this.medicalCertificateItem.get('startDate');
    const numberOfDaysFC = this.medicalCertificateItem.get('numberOfDays');
    const remarkFC = this.medicalCertificateItem.get('remark');

    this.addMandatorySetting(purposeFC);
    this.addMandatorySetting(startDateFC);
    this.addMandatorySetting(numberOfDaysFC);

    this.medicalCertificateItem.valueChanges
      .pipe(debounceTime(50), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(res => {
        const certificate = this.medicalCertificateItem.value;
        const { purpose, numberOfDays } = certificate;
        const adjustedEndDate = numberOfDays - 1 >= 0 ? numberOfDays - 1 : 0;
        const startDate = moment(certificate.startDate, DB_FULL_DATE_FORMAT).format(DISPLAY_DATE_FORMAT);
        const endDate = moment(certificate.startDate, DISPLAY_DATE_FORMAT)
          .add(adjustedEndDate, 'days')
          .format(DISPLAY_DATE_FORMAT);

        this.medicalCertificateItem.patchValue(
          {
            startDate,
            endDate,
            str: `${purpose} for ${numberOfDays} day(s) from ${startDate} to ${endDate}`
          },
          { emitEvent: false }
        );

        if (purpose === 'OTHERS') {
          this.addMandatorySetting(remarkFC);
        } else {
          this.removeMandatorySetting(remarkFC);
        }
      });

    this.roundValueToPointFive();
  }

  addMandatorySetting(control: AbstractControl) {
    control.setValidators([Validators.required]);
    control.markAsTouched();
    control.updateValueAndValidity();
  }

  removeMandatorySetting(control: AbstractControl) {
    control.setValidators(null);
    control.markAsTouched();
    control.updateValueAndValidity();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.logger.info('MC Changes', changes);
  }

  removeItem() {
    const parent = this.medicalCertificateItem.parent as FormArray;
    parent.removeAt(this.index);
  }

  generateReasonsDropdown() {
    this.reasons = MC_REASONS_DROPDOWN;
    this.halfDayOptions = MC_HALFDAY_OPTIONS;
  }

  roundValueToPointFive() {
    this.medicalCertificateItem
      .get('numberOfDays')
      .valueChanges
      .pipe(filter(term => {
        const isWholeNumber = term - Math.floor(term) == 0 ? true : false;
        if (!isWholeNumber) {
          if (!this.medicalCertificateItem.get('halfDayOption')) {
            this.medicalCertificateItem.addControl('halfDayOption', new FormControl('', Validators.required));
            this.medicalCertificateItem.get('halfDayOption').markAsTouched();
            this.medicalCertificateItem.get('halfDayOption').updateValueAndValidity();
          }

          return term;
        } else {
          this.medicalCertificateItem.removeControl('halfDayOption');
          this.medicalCertificateItem.updateValueAndValidity();
        }
      }), distinctUntilChanged(), debounceTime(400))
      .subscribe(value => {
        const roundedValue = Math.floor(value) + 0.5;
        value = roundedValue;
        this.medicalCertificateItem.get('numberOfDays').patchValue(value);
      });
  }

  isRoundNumber(value) {
    return value - Math.floor(value) == 0 ? true : false;
  }
}
