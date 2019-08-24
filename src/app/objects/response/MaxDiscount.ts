export interface MaxDiscount {
  decreaseValue: number;
  increaseValue: number;
  paymentType: string;
}

export class MaxDiscountClass implements MaxDiscount {
  constructor(decreaseValue = 0, increaseValue = 0, paymentType = '') {
    this.decreaseValue = decreaseValue;
    this.increaseValue = increaseValue;
    this.paymentType = paymentType;
  }

  decreaseValue = 0;
  increaseValue = 0;
  paymentType = '';
}
