import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { ALLERGY_TYPES, ALLERGIES, DISPLAY_DATE_FORMAT } from './../constants/app.constants';
import { UtilsService } from './utils.service';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AllergiesFormService {
  allergies;
  alerts;

  constructor(
    private utilsService: UtilsService,
    private fb: FormBuilder
  ) { }

    // managing allergy alerts
    // newAllergyAlertArrayItem() {
    //   const types = this.utilsService.convertStringArrayToMenuOptions(ALLERGY_TYPES);
    //   const allergies = this.utilsService.convertStringArrayToMenuOptions(ALLERGIES);
  
    //   const item = this.fb.group({
    //     types: { value: types },
    //     type: ['', Validators.required],
    //     allergies: { value: allergies },
    //     name: ['', Validators.required],
    //     remarks: '',
    //     addedDate: moment().format(DISPLAY_DATE_FORMAT),
  
    //     isDelete: false,
    //     deleteIndex: -1
    //   });
  
    //   item.valueChanges
    //     .pipe(debounceTime(50), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
    //     .subscribe(values => this.subscribeAlertArrayItemValueChanges(item, values));
  
    //   return item;
    // }

    // formatAlertArrayItem(allergy) {
    //   const types = this.utilsService.convertStringArrayToMenuOptions(ALLERGY_TYPES);
    //   const allergies = this.utilsService.convertStringArrayToMenuOptions(ALLERGIES);
  
    //   const item = this.fb.group({
    //     types: { value: types },
    //     type: [allergy.allergyType, Validators.required],
    //     allergies: { value: allergies },
    //     name: [allergy.name, Validators.required],
    //     remarks: allergy.remarks,
    //     addedDate: allergy.addedDate,
  
    //     isDelete: false,
    //     deleteIndex: -1
    //   });
  
    //   item.valueChanges
    //     .pipe(debounceTime(50), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
    //     .subscribe(values => this.subscribeAlertArrayItemValueChanges(item, values));
  
    //   return item;
    // }

    // subscribeAlertArrayItemValueChanges(item: FormGroup, values, patientInfo) {
    //   const pInfo = patientInfo;
  
    //   if (values.isDelete) {
    //     pInfo.allergies.splice(values.deleteIndex, 1);
    //     return;
    //   }
  
    //   const formArray = item.parent as FormArray;
    //   const index = formArray.value.map(arr => JSON.stringify(arr)).indexOf(JSON.stringify(values));
    //   const info = pInfo.allergies[index];
    //   if (!info) {
    //     const updatedInfo = <any>{
    //       allergyType: values.type,
    //       name: values.name,
    //       remarks: values.remarks,
    //       addedDate: moment().format(DISPLAY_DATE_FORMAT)
    //     };
    //     pInfo.allergies.push(updatedInfo);
    //   } else {
    //     info.allergyType = values.type;
    //     info.name = values.name;
    //     info.remarks = values.remarks;
    //     info.addedDate = values.addedDate;
    //   }
    // }
}
