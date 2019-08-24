import { MaxDiscount } from './MaxDiscount';
export interface MedicalTest {
  id: string;
  category: string;
  code: string;
  name: string;
  charge: Charge;
  priceAdjustment: MaxDiscount;
  status: string;
  laboratories: Laboratory[];
}

interface Laboratory {
  name: string;
  address: Address;
}

interface Address {
  attentionTo: string;
  street: string;
  unit: string;
  postalCode: string;
}

interface Charge {
  price: number;
  taxIncluded: boolean;
}
