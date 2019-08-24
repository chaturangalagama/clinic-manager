export class InventoryItem {
  id: string;
  name: string;
  description: string;
  baseUom: string;
  purchaseUom: string;
  dosageUom: string;
  cost: Price;
  reorderQty: string;

  constructor(
    id: string = '',
    name: string = '',
    description: string = '',
    baseUom: string = '',
    purchaseUom: string = '',
    dosageUom: string = '',
    cost: Price = undefined,
    reorderQty: string = ''
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.baseUom = baseUom;
    this.purchaseUom = purchaseUom;
    this.dosageUom = dosageUom;
    this.cost = cost;
    this.reorderQty = reorderQty;
  }
}


export class Price {
  price: number;
  taxIncluded: boolean;
}