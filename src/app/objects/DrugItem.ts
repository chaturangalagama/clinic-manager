export interface DrugItem {
  id: string;
  code: string;
  name: string;
  uom: string;
  price: Price;
  dosageInstruction: DosageInstruction;
  instruction: Instruction;
  priceAdjustment: MaxDiscount;
  recommendedDose: number;
  basePrice: Price;
  ingredients: Ingredient[];
  supplierIds: string[];
  category: string;
  packSize: number;
  minimumDispenseAmount: number;
  standardDispenseAmount: number;
  cautionary: string[];
}

interface Ingredient {
  name: string;
  uom: string;
  dose: number;
}

interface MaxDiscount {
  decreaseValue: number;
  increaseValue: number;
  paymentType: string;
}

export interface Instruction {
  code: string;
  frequencyPerDay: number;
  instruct: string;
  cautionary?: string;
}

export interface DosageInstruction {
  code: string;
  instruct: string;
}

interface Price {
  price: number;
  taxIncluded: boolean;
}
