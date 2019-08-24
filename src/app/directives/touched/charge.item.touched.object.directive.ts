import { ChargeItemDescription } from '../../objects/ChargeItemDescription';
import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appChargeItemTouchedObject]'
})
export class ChargeItemTouchedObjectDirective {
  @Output() onTopChargeItemDescriptionChanged: EventEmitter<any> = new EventEmitter();

  @Input() chargeItemData: ChargeItemDescription;


  constructor(private el: ElementRef) {}

  @HostListener('click', ['$event'])
  onClick($event: any) {
    console.log('touched');
    this.onTopChargeItemDescriptionChanged.emit(this.chargeItemData);
  }
}
