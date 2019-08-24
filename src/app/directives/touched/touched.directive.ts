import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[appTouched]'
})
export class TouchedDirective {
  @Input() formGroup: FormGroup;

  constructor(private el: ElementRef) { }

  @HostListener('click', ['$event'])
  onClick($event: any) {
    this.formGroup.markAsTouched();
    this.formGroup.patchValue({
      touchTimes: this.formGroup.value.touchTimes + 1
    });
  }
}
