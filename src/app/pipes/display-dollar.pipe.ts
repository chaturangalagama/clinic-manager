import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayDollar'
})
export class DisplayDollarPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return parseFloat((value/100).toFixed(2));
  }

}
