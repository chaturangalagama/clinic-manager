import { MaxDiscount } from './../response/MaxDiscount';
import { AttachedMedicalCoverage } from '../AttachedMedicalCoverage';
export interface IssuedMedicalTest {
    issuedMedicalTestDetails: IssuedMedicalTestDetail[];
}

export interface IssuedMedicalTestDetail {
    testId: string;
    suggestedLocation: string;

    priceAdjustment: MaxDiscount;
    attachedMedicalCoverages: AttachedMedicalCoverage;
}

export interface Payment {
    value: number;
    paymentType: string;
}
