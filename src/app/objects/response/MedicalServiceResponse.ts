import { MaxDiscount } from './MaxDiscount';
export interface MedicalServiceResponse {
    id: string;
    name: string;
    description: string;
    medicalServiceItemList: MedicalServiceItemList[];
}

export interface MedicalServiceItemList {
    id: string;
    name: string;
    description: string;
    chargeAmount: ChargeAmount;
    priceAdjustment: MaxDiscount;
}

export interface ChargeAmount {
    price: number;
    taxIncluded: boolean;
}
