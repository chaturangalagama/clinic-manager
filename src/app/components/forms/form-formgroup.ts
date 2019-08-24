import { FormBase } from './../../model/FormBase';

export class FormGroupForm extends FormBase<any> {
    controlType = 'formgroup';

    constructor(options: {} = {}) {
        super(options);
    }
}
