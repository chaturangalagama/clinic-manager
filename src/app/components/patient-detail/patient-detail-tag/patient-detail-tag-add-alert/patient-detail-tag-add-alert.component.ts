import { StoreService } from './../../../../services/store.service';
import { AlertService } from './../../../../services/alert.service';
import { Component, OnInit } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-patient-detail-tag-add-alert',
  templateUrl: './patient-detail-tag-add-alert.component.html',
  styleUrls: ['./patient-detail-tag-add-alert.component.scss']
})
export class PatientDetailTagAddAlertComponent implements OnInit {
  // Carrier for Alert Information
  alertFormGroup: FormGroup;

  selectedAllergyType: string[];
  title: string;
  drugList: any;
  allergyGroupList: any;

  constructor(public bsModalRef: BsModalRef, private store: StoreService, private alertService: AlertService) {}

  public event: EventEmitter<any> = new EventEmitter();
  ngOnInit() {
    this.selectedAllergyType = [];
    this.drugList = this.store.chargeItemList.map(item => item.item).filter(item => item.itemType === 'DRUG');
    this.allergyGroupList = this.store.allergyGroupList;
  }

  populateAllergyGroupList() {
    if (this.store.allergyGroupList.length < 1) {
      if (this.store.errorMessages['listAllergyGroups'] !== undefined) {
        this.alertService.error(JSON.stringify(this.store.errorMessages['listAllergyGroups']));
      } else {
        this.store.getAllergyGroupList();
      }
    } else {
      this.allergyGroupList = this.store.allergyGroupList;
    }
  }

  onSelect($event) {
    console.log('selected allergy', event);
    this.populateAllergyGroupList();
  }

  onDelete(form: FormGroup, index: number) {
    form.patchValue({
      isDelete: true,
      deleteIndex: index
    });
    const formArray = form.parent as FormArray;

    formArray.removeAt(index);
  }

  onBtnAdd(form: FormGroup) {
    form.patchValue({
      isAdd: true
    });
  }

  onSave() {
    this.alertFormGroup.get('requiredSave').patchValue(true);
    this.bsModalRef.hide();
  }

  onBtnExit(form: FormGroup) {
    const listOfAllergies = form.get('alertArray') as FormArray;
    console.log('listOfAllergies: ', listOfAllergies);
    listOfAllergies.value.forEach((allergy, index) => {
      if (allergy.name === '' || allergy.type === '') {
        listOfAllergies.removeAt(index);
      }
    });
    console.log('listOfAllergies: ', listOfAllergies);
    this.bsModalRef.hide();
  }
}
