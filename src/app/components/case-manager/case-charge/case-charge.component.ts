import { FormArray, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChargeItemDescription } from '../../../objects/ChargeItemDescription';
import { CaseChargeFormService } from '../../../services/case-charge-form.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-case-charge',
  templateUrl: './case-charge.component.html',
  styleUrls: ['./case-charge.component.scss']
})
export class CaseChargeComponent implements OnInit {
  @Input() public itemsFormArray: FormArray;
  @Input() index: number;
  @Input() caseStatus: string;
  @Output() onFirstChargeItemDetailsAdded = new EventEmitter<FormArray>();
  @Output() handleChargeItemChange = new EventEmitter<any>();

  caseChargeForm: FormGroup;
  chargeItemDescription: ChargeItemDescription;
  checkboxValue = false;

  constructor(private caseChargeFormService: CaseChargeFormService) {}

  ngOnInit() {
    this.chargeItemDescription = { charge: '', cautionary: '', sig: '', remarks: '' };

    this.itemsFormArray.valueChanges.pipe(take(1)).subscribe(value => {
      //add validators for first data init
      this.itemsFormArray.controls.forEach(item => {
        this.setChargeItemValidate(<FormGroup>item);
      });
    });

    console.log('itemsFormArray: ', this.itemsFormArray);
  }

  addItem() {
    console.log('itemsformArray: ', this.itemsFormArray);
    this.itemsFormArray = this.caseChargeFormService.addMultipleChargeItems(true, 1);
    const formgroup: FormGroup = <FormGroup>this.itemsFormArray.at(this.itemsFormArray.length - 1);
    formgroup
      .get('drugId')
      .valueChanges.pipe(take(1))
      .subscribe(value => {
        console.log('itemsformArray is value: ', value);
        this.setChargeItemValidate(formgroup);
      });

    if (this.itemsFormArray.value == null) {
      console.log('itemsformArray is null: ', this.itemsFormArray);
      this.onFirstChargeItemDetailsAdded.emit(this.itemsFormArray);
    }
  }

  onTopChargeItemDescriptionChanged(event: ChargeItemDescription) {
    this.chargeItemDescription = event;
    this.handleChargeItemChange.emit({});
  }

  deleteItem() {
    let arr = [];
    let index = 0;
    this.itemsFormArray.value.forEach(element => {
      let isChecked = this.itemsFormArray.value[index]['isChecked'];
      if (isChecked == true) arr.push(index);
      index++;
    });
    arr.sort(function(a, b) {
      return b - a;
    });
    arr.forEach(element => {
      this.itemsFormArray.removeAt(element);
    });
    this.checkboxValue = false;
    this.onTopChargeItemDescriptionChanged({ charge: '', cautionary: '', sig: '', remarks: '' });
  }

  onCheckAll(event) {
    console.log('onCheckAll - ' + event);
    if (event == 'T') {
      this.itemsFormArray.controls.forEach(element => {
        element.get('isChecked').patchValue(true);
      });
    } else {
      this.itemsFormArray.controls.forEach(element => {
        element.get('isChecked').patchValue(false);
      });
    }
  }

  onHandleChargeItemChange(event) {
    console.log('handleChargeItemChange event', event);
    this.handleChargeItemChange.emit(event);
  }

  setChargeItemValidate(item: FormGroup) {
    item.get('drugId').setValidators([Validators.required]);
    item.get('drugId').updateValueAndValidity({emitEvent:false});
    item.get('drugId').markAsTouched();
    item.get('purchaseQty').setValidators([Validators.required, Validators.min(0.01)]);
    item.get('purchaseQty').updateValueAndValidity({emitEvent:false});
    item.get('purchaseQty').markAsTouched();
    item.get('batchNumber').setValidators([Validators.required]);
    item.get('batchNumber').updateValueAndValidity({emitEvent:false});
    item.get('batchNumber').markAsTouched();
    item.get('expiryDate').setValidators([Validators.required]);
    item.get('expiryDate').updateValueAndValidity({emitEvent:false});
    item.get('expiryDate').markAsTouched();
  }
}
