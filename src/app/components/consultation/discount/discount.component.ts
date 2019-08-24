import { UtilsService } from './../../../services/utils.service';
import { MaxDiscount, MaxDiscountClass } from './../../../objects/response/MaxDiscount';
import { FormGroup, AbstractControl, ValidatorFn, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GST } from '../../../constants/app.constants';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss']
})
export class DiscountComponent implements OnInit, OnChanges {
  @Input() discountGroup: FormGroup;
  @Input() stock: Number;
  @Input() isStockShown: boolean;
  @Input() discountInfo: any;
  // @Input() isDiscountGiven: boolean;
  @Input() isDiscountShown: boolean;
  @Input() unitPrice: number;
  @Input() maxDiscount: MaxDiscountClass;
  @Input() totalPrice: number;
  @Input() quantity: number;

  isDiscountEnabled: boolean;
  discountedPrice: number;
  isIncreasedEnabled: boolean;
  isDecreasedEnabled: boolean;

  constructor(private utils: UtilsService) {
    this.isDiscountEnabled = false;
    this.setAllPriceAdjusment(false);
  }

  ngOnInit() {
    this.onValueChanges();

    this.subscribeValuChanges();

    if (this.discountGroup.get('increaseValue').value > 0) {
      this.isDecreasedEnabled = false;
      this.discountGroup.get('increaseValue').updateValueAndValidity()
    } else {
      this.isDecreasedEnabled = true;
    }

    if (this.discountGroup.get('decreaseValue').value > 0) {
      this.isIncreasedEnabled = false;
      this.discountGroup.get('decreaseValue').updateValueAndValidity()
    } else {
      this.isIncreasedEnabled = true;
    }

    console.log('hack-in', +this.unitPrice, +this.quantity);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('DISCOUNT CHANGES', changes);

    if (changes.unitPrice) {
      console.log('md changes', changes.unitPrice);
      // this.setDiscountValidation();
      this.setMaxDiscValidation();

      if (changes.unitPrice.currentValue > 0) {
        this.isDiscountEnabled = true;
        this.setAllPriceAdjusment(true);
      } else {
        this.isDiscountEnabled = false;
        this.setAllPriceAdjusment(false);
      }
    }
  }

  setAllPriceAdjusment(flag: boolean) {
    console.log('flag', flag, this.unitPrice);
    this.isDecreasedEnabled = flag;
    this.isIncreasedEnabled = flag;
  }

  subscribeValuChanges() {
    this.discountGroup.get('increaseValue').valueChanges.subscribe(value => {
      console.log('Increase Changed', value);
      if (value > 0) {
        this.isDecreasedEnabled = false;
      } else {
        this.isDecreasedEnabled = true;
      }
    });

    this.discountGroup.get('decreaseValue').valueChanges.subscribe(value => {
      console.log('Decrease Changed', value);
      if (value > 0) {
        this.isIncreasedEnabled = false;
      } else {
        this.isIncreasedEnabled = true;
      }
    });
  }

  setMaxDiscValidation() {
    console.log('maxDisc', this.maxDiscount);
    if (this.discountGroup.get('decreaseValue')) {
      //   const price = +this.totalPrice;
      // TODO: Add validation for disc>total price
      this.discountGroup.get('decreaseValue').setValidators([maxDiscountValidator(this.maxDiscount.decreaseValue)]);
      this.discountGroup.get('decreaseValue').updateValueAndValidity();
    }
  }

  onValueChanges() {
    // Activate Remark validation when discount is filled
    this.setMaxDiscValidation();
    this.discountGroup.get('decreaseValue').valueChanges.subscribe(val => {
      console.log('new value', val);
      if (val > 0) {
        this.discountGroup.get('remark').markAsTouched();
        this.discountGroup.get('remark').setValidators([Validators.required]);

        this.discountGroup.get('remark').updateValueAndValidity();
      } else {
        this.discountGroup.get('remark').setValidators(null);
        this.discountGroup.get('remark').updateValueAndValidity();
      }
      if (this.unitPrice && this.quantity && this.totalPrice) {
        if (this.maxDiscount.paymentType === 'DOLLAR') {
          console.log('hack', +this.unitPrice, +this.quantity);
          this.discountedPrice = (+this.unitPrice - +val) * +this.quantity * GST;
          this.discountedPrice = this.utils.round(this.discountedPrice, 2);
        } else {
          this.discountedPrice = this.unitPrice * this.quantity * (1 - val / 100) * GST;
          this.discountedPrice = this.utils.round(this.discountedPrice, 2);
        }
      }
    });
    this.discountGroup.get('increaseValue').valueChanges.subscribe(val => {
      console.log('new value', val);
      if (val > 0) {
        this.discountGroup.get('remark').markAsTouched();
        this.discountGroup.get('remark').setValidators([Validators.required]);

        this.discountGroup.get('remark').updateValueAndValidity();
      } else {
        this.discountGroup.get('remark').setValidators(null);
        this.discountGroup.get('remark').updateValueAndValidity();
      }
      if (this.unitPrice && this.quantity && this.totalPrice) {
        if (this.maxDiscount.paymentType === 'DOLLAR') {
          console.log('hack', +this.unitPrice, +this.quantity);
          this.discountedPrice = (+this.unitPrice + +val) * +this.quantity * GST;
          this.discountedPrice = this.utils.round(this.discountedPrice, 2);
        } else {
          this.discountedPrice = this.unitPrice * this.quantity * (1 + val / 100) * GST;
          this.discountedPrice = this.utils.round(this.discountedPrice, 2);
        }
      }
    });
  }

  isDollarDiscount() {
    return this.maxDiscount.paymentType === 'DOLLAR';
  }

  isPercentageDiscount() {
    return this.maxDiscount.paymentType === 'PERCENTAGE';
  }
}

export function maxDiscountValidator(maxDisc: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const isInvalidDisc = control.value > 0 && control.value > maxDisc;
    console.log('DISC', control.value, maxDisc, isInvalidDisc);
    // return isValidDisc ? { invalidDiscount: { value: control.value } } : null;
    return isInvalidDisc
      ? {
          invalidDiscount: {
            value: control.value,
            message: maxDisc > 0 ? 'Invalid Discount, max is ' + maxDisc : 'No Disc Allowed'
          }
        }
      : null;
  };
}

export function maxPriceDiscountValidator(maxPrice: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const isInvalidDisc = control.value > maxPrice;
    console.log('DISCP', control.value, maxPrice, isInvalidDisc);
    // return isValidDisc ? { invalidDiscount: { value: control.value } } : null;
    return isInvalidDisc
      ? {
          invalidDiscount: {
            value: control.value,
            message: maxPrice > 0 ? 'Invalid Discount, max is ' + maxPrice : 'No Disc Allowed'
          }
        }
      : null;
  };
}
