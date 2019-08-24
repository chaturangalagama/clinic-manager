  export  class ChargeDetailsItem {
    itemId?: string;
    excludedPlans?: any[];
    quantity?: number;
  
    constructor(itemId?: string, excludedPlans?: any[], quantity?: number) {
      this.itemId = itemId || '';
      this.excludedPlans = excludedPlans ? excludedPlans : [];
      this.quantity = quantity || 0;
    }
  }
  