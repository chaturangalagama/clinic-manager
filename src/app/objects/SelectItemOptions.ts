import { IOption } from 'ng-select';
export class SelectItemOptions<T> implements IOption {
    value: string;
    label: string;
    disabled?: boolean;
    data: T;
}
