export class FormBase<T> {
    value: T;
    key: string;
    label: string;
    required: boolean;
    order: number;
    controlType: string;
    validation: any[];
    col: string;
    formControls: FormBase<any>[];

    constructor(
        options: {
            value?: T;
            key?: string;
            label?: string;
            required?: boolean;
            order?: number;
            controlType?: string;
            validation?: any[];
            col?: string;
            formControls?: FormBase<any>[];
        } = {}
    ) {
        this.value = options.value;
        this.key = options.key || '';
        this.label = options.label || '';
        this.required = !!options.required;
        this.order = options.order === undefined ? 1 : options.order;
        this.controlType = options.controlType || '';
        this.validation = options.validation;
        this.col = options.col || 'col-12';
        this.formControls = options.formControls || [];
    }
}
