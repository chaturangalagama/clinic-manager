import { AttachedMedicalCoverage } from '../AttachedMedicalCoverage';

export interface ImmunisationGiven {
    immunisation: Array<Immunisation>;
}

export interface Immunisation {
    serviceId: string;
    serviceItemId: string;
    priceAdjustment: DiscountGiven;
    batchNumber: string;
    nextDose: string;
    vaccinationId: string;
    doseId: string;
    attachedMedicalCoverages: AttachedMedicalCoverage;
}

export interface DiscountGiven {
    decreaseValue: number;
    increaseValue: number;
    paymentType: string;
}
