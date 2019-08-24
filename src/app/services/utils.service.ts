import { FormBuilder } from '@angular/forms';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class UtilsService {
  constructor(private fb: FormBuilder) {}

  getDBDate(inputDate) {
    let date = moment(Date.now());
    if (inputDate) {
      date = moment(inputDate);
    }
    console.log('ddate', date);
    return date.format('DD-MM-YYYYTHH:mm:ss');
  }

  getDBDateOnly(inputDate) {
    let date = moment(Date.now());
    if (inputDate) {
      date = moment(inputDate);
    }
    // const date = moment(Date.now());
    console.log('ddate', date);
    return date.format('DD-MM-YYYY');
  }

  validateDates(startDate: moment.Moment, endDate: moment.Moment) {
    return startDate.isSameOrBefore(endDate);
  }

  mapToDisplayOptions(array) {
    return array.map(data => {
      return {
        value: data,
        label: this.convertToTitleCase(data)
      };
    });
  }

  convertUnixDateToDashFormat(date) {
    return moment.unix(date).format('DD-MM-YYYY');
  }

  convertToTitleCase(data) {
    let tempString: string = data + '';

    // If data is delimiter-separated ('_')
    tempString = tempString
      .split('_')
      .map(word => {
        const length = word.length;
        return word.charAt(0).toUpperCase() + word.slice(1, length).toLowerCase();
      })
      .join(' ');

    // For other naming conventions or data types in future, add accordingly
    return tempString;
  }

  formatToE164PhoneNumber(number: string) {
    if (!number || number === '+') {
      // return '+65';
      return '';
    } else {
      return number;
    }
  }

  replaceHyphenWithSpace(str: string) {
    return str.replace('_', ' ');
  }

  convertToTitleCaseUsingSpace(data) {
    let tempString: string = data + '';

    // If data is delimiter-separated ('_')
    tempString = tempString
      .split(' ')
      .map(word => {
        const length = word.length;
        return word.charAt(0).toUpperCase() + word.slice(1, length).toLowerCase();
      })
      .join(' ');

    // For other naming conventions or data types in future, add accordingly
    return tempString;
  }

  convertStringArrayToMenuOptions(array) {
    const menu = array.map(data => {
      return {
        value: data,
        label: this.convertToTitleCase(data)
      };
    });
    return menu;
  }

  round(number, precision) {
    const factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  pick(obj: Object, keys): Object {
    return Object.keys(obj)
      .filter(key => keys.includes(key))
      .reduce((pickedObj, key) => {
        pickedObj[key] = obj[key];
        return pickedObj;
      }, {});
  }
}
