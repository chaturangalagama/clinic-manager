interface DispatchItemEntity {
    itemId?: string;
    dosageUom?: string;
    instruct?: string;
    duration?: number;
    dosage?: number;
    quantity?: number;
    oriTotalPrice?: string;
    batchNo?: string;
    expiryDate?: string;
    remarks?: string;
    itemPriceAdjustment?: ItemPriceAdjustment;
    excludedCoveragePlanIds?: string[];
    itemCode?: string;
    itemName?: string;
  }
  
  interface ItemPriceAdjustment {
    adjustedValue?: string;
    paymentType?: string;
    remark?: string;
  }