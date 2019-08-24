import { FormBase } from './../../model/FormBase';
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-form-container',
    templateUrl: './dynamic-form-container.component.html'
})
export class DynamicFormContainerComponent {
    @Input() question: FormBase<any>;
    @Input() question1: any;
    @Input() form: FormGroup;
    get isValid() {
        return this.form.controls[this.question.key].valid;
    }

    get isError() {
        const { errors } = this.form.controls[this.question.key];
        if (errors) {
            return true;
        }

        return false;
    }

    get error() {
        const { errors } = this.form.controls[this.question.key];

        if (errors) {
            console.log('what', errors);
        }
        return errors;
    }

    get isTouched() {
        return this.form.controls[this.question.key].touched;
    }

    get isDirty() {
        return this.form.controls[this.question.key].dirty;
    }
}
