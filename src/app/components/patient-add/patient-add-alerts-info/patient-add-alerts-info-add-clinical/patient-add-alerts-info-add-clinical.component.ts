import { PatientService } from './../../../../services/patient.service';
import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UtilsService } from '../../../../services/utils.service';

@Component({
  selector: 'app-patient-add-alerts-info-add-clinical',
  templateUrl: './patient-add-alerts-info-add-clinical.component.html',
  styleUrls: ['./patient-add-alerts-info-add-clinical.component.scss']
})
export class PatientAddAlertsInfoAddClinicalComponent implements OnInit {
  medicalAlertFormGroup: FormGroup;
  medicalAlertFormGroupOriginal: FormGroup;
  originalAlertArray: any;

  trashArray: FormArray;
  title: string;

  constructor(
    private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    private eRef: ElementRef,
    private utilService: UtilsService
  ) {}

  ngOnInit() {
    this.medicalAlertFormGroupOriginal = Object.assign({}, this.medicalAlertFormGroup) as FormGroup;
    this.originalAlertArray = this.medicalAlertFormGroupOriginal.value.alertArray;
    this.trashArray = this.fb.array([]);
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    console.log('event.target: ', event.target);

    if (this.eRef.nativeElement.contains(event.target) || this.eRef.nativeElement.contains(event.target)) {
      console.log('CLICKING INSIDE');
    } else {
      //  this.medicalAlertFormGroup.patchValue({ alertArray: this.originalAlertArray });

      console.log('ONCLICKOUT');
    }
  }

  toggleDisabled(event) {
    console.log('control : ', event);
  }

  onDelete(form: FormGroup, index: number) {
    form.patchValue({
      isDelete: true,
      deleteIndex: index,
      requiredSave: true
    });
    const formArray = form.parent as FormArray;

    console.log('form.parent: ', formArray);

    if (index === 0 && this.medicalAlertFormGroup.get('alertArray').value.length === 1) {
      console.log('LENGTH: ', this.medicalAlertFormGroup.get('alertArray').value.length);
      if (
        //If have initialized first element
        this.medicalAlertFormGroup.get('alertArray').value[0].type !== '' ||
        this.medicalAlertFormGroup.get('alertArray').value[0].name !== '' ||
        this.medicalAlertFormGroup.get('alertArray').value[0].remark !== ''
      ) {
        const controlToBeTrashed = formArray.at(index) as FormArray;
        console.log('controlToBeTrashed: ', controlToBeTrashed);
        if (controlToBeTrashed.value.isEdit === false) {
          // if element is already aregistered id
          formArray.removeAt(index);
          this.medicalAlertFormGroup.get('trashArray').value.push(controlToBeTrashed);
        } else {
          formArray.removeAt(index);
        }
      } else {
        console.log('Do nothing');
      }
    } else {
      const controlToBeTrashed = formArray.at(index) as FormArray;
      console.log('controlToBeTrashed: ', controlToBeTrashed);
      if (controlToBeTrashed.value.isEdit === false) {
        formArray.removeAt(index);
        this.medicalAlertFormGroup.get('trashArray').value.push(controlToBeTrashed);
      } else {
        console.log('Item is not saved');
        formArray.removeAt(index);
      }
    }
  }

  onBtnAdd(form: FormGroup) {
    console.log('On Btn Add');
    form.patchValue({
      isAdd: true
    });
  }

  onBtnSave(form: FormGroup) {
    form.patchValue({
      requiredSave: true
    });
    console.log('form saved: ', form);
    this.bsModalRef.hide();
    console.log('Save button clicked');

    // let form be medical coverage form group
  }

  onBtnExit(form: FormGroup) {
    console.log('form: ', form);
    const listOfAllergies = form.get('alertArray') as FormArray;

    listOfAllergies.value.forEach((allergy, index) => {
      if (allergy.name === '' || allergy.type === '' || allergy.priority === '') {
        listOfAllergies.removeAt(index);
      }
    });

    // form.patchValue({
    //   requiredSave: true
    // });
    this.bsModalRef.hide();
    console.log('exit button clicked');

    // let form be medical coverage form group
  }

  formatToTitleCase(input: any) {
    return this.utilService.convertToTitleCase(input);
  }
}
