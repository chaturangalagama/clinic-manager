import { TopDrugDescription } from './../../objects/DrugDescription';
import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[appTouchedObject]'
})
export class TouchedObjectDirective {
  @Output() onTopDrugDescriptionChanged: EventEmitter<any> = new EventEmitter();

  @Input() drugData: TopDrugDescription;
  // @Input() changed: any;

  constructor(private el: ElementRef) {}

  @HostListener('click', ['$event'])
  onClick($event: any) {
    // this.formGroup.markAsTouched();
    // this.formGroup.updateValueAndValidity({ onlySelf: false, emitEvent: true });
    console.log('touched');
    this.onTopDrugDescriptionChanged.emit(this.drugData);
    // this.changed;
  }
}
