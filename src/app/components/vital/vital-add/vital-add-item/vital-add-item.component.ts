import { distinctUntilChanged } from 'rxjs/operators';
import { FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { VitalConfiguration } from '../../../../objects/response/VitalConfiguration';
import { StoreService } from '../../../../services/store.service';
import { VitalFormService } from '../../../../services/vital-form.service';

@Component({
  selector: 'app-vital-add-item',
  templateUrl: './vital-add-item.component.html',
  styleUrls: ['./vital-add-item.component.scss']
})
export class VitalAddItemComponent implements OnInit, AfterViewInit {
  @Input() vitalItem: FormGroup;
  @Input() index: number;
  @Input() vitals: Array<VitalConfiguration>;

  uom: string;
  private currentItem: string;

  constructor(private vitalFormService: VitalFormService, private store: StoreService) {}

  ngOnInit() {
    this.subscribeChanges();

    const item = this.vitalItem.get('code').value;
    if (item) {
      this.uom = this.getItem(item).uom;
    }
  }

  ngAfterViewInit() {}

  subscribeChanges() {}

  disabledItem(key: string) {
    this.vitals.forEach(element => {
      if (element.code === key) {
        element.disabled = true;
      }
    });
  }

  enableItem(key: string) {
    this.vitals.forEach(element => {
      if (element.code === key) {
        element.disabled = false;
      }
    });
  }

  getItem(key: string) {
    return this.vitals.find(val => val.code === key);
  }

  onVitalOptionSelected(item) {
    const valueControl = this.vitalItem.get('value');

    if (this.currentItem) {
      this.enableItem(this.currentItem);
    }
    if (!item) {
      this.uom = '';

      valueControl.disable();
      valueControl.setValidators(null);
      valueControl.markAsTouched({ onlySelf: true });
      valueControl.updateValueAndValidity({ emitEvent: false });
      return;
    }

    // set value field to be mandatory

    valueControl.enable();
    valueControl.setValidators([Validators.required]);
    valueControl.markAsTouched({ onlySelf: true });
    valueControl.updateValueAndValidity({ emitEvent: false });

    // Set UOM and disable current option
    this.currentItem = item;
    this.uom = this.getItem(item).uom;
    this.disabledItem(item);
  }

  removeVital() {
    try {
      this.enableItem(this.vitalFormService.vitalSignFormArray.controls[this.index].get('code').value);
    } catch (e) {
      console.log('​VitalAddComponent -> }catch -> e', e);
    }

    this.vitalFormService.deleteItem(this.index);
  }
}
