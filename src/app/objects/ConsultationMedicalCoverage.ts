export interface ConsultationMedicalCoverage {
    name: string;
    price: Price;
    medicalCoverageId: string;
    planId: string;
}

interface Price {
    price: number;
    taxIncluded: boolean;
}
