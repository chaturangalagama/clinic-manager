export interface MedicalServiceGiven {
    medicalServices: Array<MedicalService>;
}

export interface MedicalService {
    serviceId: string;
    serviceItemId: string;
    priceAdjustment?: DiscountGiven;
}

export interface DiscountGiven {
    decreaseValue: number;
    increaseValue: number;
    paymentType: string;
}
