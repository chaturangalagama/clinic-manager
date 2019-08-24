import { Component, Input } from '@angular/core';
import { AbstractControlDirective, AbstractControl } from '@angular/forms';

@Component({
  selector: 'errors',
  template: `
    <small>
        <ul class="p-0 m-0" *ngIf="showErrors()">
            <li style="color: red; list-style-type: none;" *ngFor="let error of errors()">{{error}}</li>
        </ul>
    </small>
  `
})
export class ErrorsComponent {
  private static readonly errorMessages = {
    required: () => 'This field is required',
    min: params => 'The min value is ' + params.min,
    minlength: params => 'The min number of characters is ' + params.requiredLength,
    maxlength: params => 'The max allowed number of characters is ' + params.requiredLength,
    pattern: params => 'The required pattern is: ' + params.requiredPattern,
    age: params => params.message,
    vaildEmail: params => params.message,
    validNumber: params => params.message,
    email: () => 'Email address is invalid.',
    userid: () => 'User ID already exists.',
    userIdIsValid: () => 'User ID is valid.',
    userIdIsNotValid: () => 'Identification is not valid.',
    zipcode: () => 'The zipcode does not exist.',
    useridNotExist: () => 'Something happened while parsing for the ID.',
    policyExpired: () => 'End date must not be before today.',
    // dateExpired: () => params.message,
    mcEndDateAfterPolicy: params => params.message,
    invalidDiscount: params => params.message,
    samePassword: params => params.message,
    bsDate: params => params.invalid,
    multiplierError: params => 'Value must be the multiplier of ' + params.multiplier
  };

  @Input() private control: AbstractControlDirective | AbstractControl;

  showErrors(): boolean {
    return this.control && this.control.errors && (this.control.dirty || this.control.touched);
  }

  errors(): string[] {
    return Object.keys(this.control.errors).map(field => this.getMessage(field, this.control.errors[field]));
  }

  private getMessage(type: string, params: any) {
    return ErrorsComponent.errorMessages[type](params);
  }
}
