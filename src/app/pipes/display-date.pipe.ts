import { DISPLAY_DATE_FORMAT, DB_FULL_DATE_FORMAT } from './../constants/app.constants';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'displayDate'
})
export class DisplayDatePipe implements PipeTransform {
    transform(value: any, args?: any): any {
        const date = moment(value, DB_FULL_DATE_FORMAT);

        return date.format(DISPLAY_DATE_FORMAT);
    }
}
