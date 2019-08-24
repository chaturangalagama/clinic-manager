import { DISPLAY_DATE_FORMAT } from './../../../constants/app.constants';
import { FormArray } from '@angular/forms';
import { MedicalCertificateItemControlComponent } from './medical-certificate-item-control.component';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import *  as moment from 'moment';

@Component({
  selector: 'app-medical-certificate-items-array',
  templateUrl: './medical-certificate-items-array.component.html'
})
export class MedicalCertificateItemsArrayComponent implements OnInit {
  @Input() public itemsFormArray: FormArray;
  @Output() onDelete = new EventEmitter<number>();
  @Input() index: number;

  static buildItems() {
    return new FormArray([MedicalCertificateItemControlComponent.buildItem('', '', 1, '', '','')]);
  }

  addItem() {
    this.itemsFormArray.push(MedicalCertificateItemControlComponent.buildItem('', '', 1, '', '',''));
  }

  constructor() {}

  ngOnInit() {}

  onbtnDeleteClicked(index) {
    console.log('emit delete', this.index);
    this.itemsFormArray.removeAt(index);
  }

  static checkMedicalCertificates(consultation) {

    if(consultation.medicalCertificates){

        const medicalCertificates = consultation.medicalCertificates;
        console.log("medicalCertificates: ",medicalCertificates);

        const newMedicalCertificates = medicalCertificates.filter(
          value => null !== value.purpose && value.purpose !== '0' && value.purpose.length > 0
        );

        if(newMedicalCertificates.length > 0 ){
          newMedicalCertificates.forEach(value => {
            if (value.otherReason) {
              value.purpose = value.otherReason;
              delete value.otherReason;
            }
            value.startDate = value.startDate && moment(value.startDate, DISPLAY_DATE_FORMAT).format(DISPLAY_DATE_FORMAT);
      
            if (value.halfDayOption === '' || value.halfDayOption === null) {
              delete value.halfDayOption;
            }
          });
      
          consultation.medicalCertificates = newMedicalCertificates;
        } else {
          delete consultation['medicalCertificates'];
        }
      }
    return consultation;
  }


  static patchMedicalCertificateToFormArray(refEntity, medicalCertificates: FormArray){
    if (refEntity.medicalCertificates && refEntity.medicalCertificates.length > 0) {
      while (medicalCertificates.controls.length > 0) {
        medicalCertificates.removeAt(0);
      }
      refEntity.medicalCertificates.forEach(mc => {
        console.log('mcForm: ', mc);
        const mcForm = MedicalCertificateItemControlComponent.buildItem(
          mc.purpose,
          mc.startDate,
          mc.numberOfDays,
          '',
          mc.remark,
          mc.referenceNumber,
          mc.halfDayOption
        );
        medicalCertificates.push(mcForm);
      });
    }
    return medicalCertificates;
  }

}
