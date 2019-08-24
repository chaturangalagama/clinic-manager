import { FormBase } from './../../model/FormBase';

export class DropdownForm extends FormBase<string> {
    controlType = 'dropdown';
    options: { key: string; value: string }[] = [];

    constructor(options: {} = {}) {
        super(options);
        this.options = options['options'] || [];
    }
}
