export default class PaymentCheck{
  chargeDetails: Array<ChargeDetailsItem>;

  constructor( chargeDetails: Array<ChargeDetailsItem>){
    this.chargeDetails = chargeDetails || [];
  }
}

export class ChargeDetailsItem {
  itemId?: string;
  excludedPlans?: Array<string>;
  quantity?: number;

  constructor(itemId?: string, excludedPlans?: Array<string>, quantity?: number) {
    this.itemId = itemId || '';
    this.excludedPlans = excludedPlans ? excludedPlans : [];
    this.quantity = quantity || 0;
  }
}
