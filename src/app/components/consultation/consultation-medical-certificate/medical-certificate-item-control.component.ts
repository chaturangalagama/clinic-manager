import { MC_REASONS_DROPDOWN, MC_HALFDAY_OPTIONS } from './../../../constants/app.constants';
import { LoggerService } from './../../../services/logger.service';
import { FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Component, OnInit, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { distinctUntilChanged, debounceTime, filter } from 'rxjs/operators';

@Component({
  selector: 'app-medical-certificate-item-control',
  templateUrl: './medical-certificate-item-control.component.html'
})
export class MedicalCertificateItemControlComponent implements OnInit, OnChanges {
  @Input() public index: number;
  @Input() public medicalCertificateItem: FormGroup;
  @Output() public removed: EventEmitter<number> = new EventEmitter<number>();
  @Output() onDelete = new EventEmitter<number>();

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

  static buildItem(purpose: string, startDate: string, numberOfDays: number, otherReason: string, remark: string,referenceNumber: string, halfDayOption?: string) {
    console.log('buildItem');

    let form = new FormGroup({
      purpose: new FormControl(purpose),
      startDate: new FormControl(startDate),
      numberOfDays: new FormControl(numberOfDays),
      otherReason: new FormControl(otherReason),
      remark: new FormControl(remark),
      referenceNumber: new FormControl(referenceNumber),
      halfDayOption: new FormControl()
    });

    if(halfDayOption){
      form.get('halfDayOption').patchValue(halfDayOption);
    }

    // this.roundValueToPointFive(form);

    // form.valueChanges.subscribe(value => {
    //   value.numberOfDays = Math.round(value.numberOfDays * 2) / 2;
    //   console.log('value changes: ', value);
    //   // form.updateValueAndValidity();
    // });
    return form;
  }

  constructor(private logger: LoggerService) {
    this.generateReasonsDropdown();
  }

  ngOnInit() {
    console.log('ngOnInit');

    const purpose = this.medicalCertificateItem.get('purpose');
    const startDate = this.medicalCertificateItem.get('startDate');
    const numberOfDays = this.medicalCertificateItem.get('numberOfDays');
    const remark = this.medicalCertificateItem.get('remark');

    startDate.patchValue(new Date());

    if(numberOfDays.value==='' || numberOfDays.value===null || numberOfDays.value===0){
      numberOfDays.patchValue(1);
    }else {
      this.roundValueToPointFive();
    }

    

    remark.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(200))
      .subscribe(value => {
        if (value) {
          this.addMandatorySetting(purpose);
        } else {
          this.removeMandatorySetting(purpose);
        }
      });

    purpose.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(200))
      .subscribe(value => {
        this.onPurposeSelected(value);

        if (value) {
          this.addMandatorySetting(startDate);
          this.addMandatorySetting(numberOfDays);
        } else {
          this.removeMandatorySetting(startDate);
          this.removeMandatorySetting(numberOfDays);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.logger.info('MC Changes', changes);
  }

  generateReasonsDropdown() {
    this.reasons = MC_REASONS_DROPDOWN;
    this.halfDayOptions = MC_HALFDAY_OPTIONS;
  }

  onPurposeSelected(option) {
    if (option) {
      if (option === 'OTHERS') {
        this.medicalCertificateItem.get('remark').setValidators([Validators.required]);
        this.medicalCertificateItem.get('remark').markAsTouched();
        this.medicalCertificateItem.get('remark').updateValueAndValidity();
        // this.isOtherShown = true;
        // const otherReasonControl = this.medicalCertificateItem.get('otherReason');
        // otherReasonControl.setValidators(Validators.required);
        // otherReasonControl.markAsTouched();
        // otherReasonControl.updateValueAndValidity();
      } else {
        // this.hideAndRemoveOtherReasonValidator();
        this.medicalCertificateItem.get('remark').setValidators(null);
        this.medicalCertificateItem.get('remark').markAsTouched();
        this.medicalCertificateItem.get('remark').updateValueAndValidity();
      }
    } else {
      // this.hideAndRemoveOtherReasonValidator();
    }
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

  hideAndRemoveOtherReasonValidator() {
    this.isOtherShown = false;
    const otherReasonControl = this.medicalCertificateItem.get('otherReason');
    otherReasonControl.patchValue('');
    otherReasonControl.setValidators(null);
    otherReasonControl.updateValueAndValidity();
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

  onBtnAddClicked() {}

  onbtnDeleteClicked() {
    console.log('emit delete', this.index);
    this.removed.emit(this.index);
  }
}
