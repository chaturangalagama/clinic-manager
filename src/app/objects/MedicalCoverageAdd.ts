export class MedicalCoverageAdd {
    id?: string;
    name: string;
    type: string;
    clinicRemarks: string;
    address: string;
    email: string;
    telephoneNumber: string;
    contactPerson: string;
    registrationRemarks: string;
    paymentRemarks: string;
    otherRemarks: string;
    coveragePlans: CoveragePlan[];

    constructor(
        name: string,
        type: string,
        clinicRemarks: string,
        address: string,
        email: string,
        telephoneNumber: string,
        contactPerson: string,
        registrationRemarks: string,
        paymentRemarks: string,
        otherRemarks: string,
        coveragePlans: CoveragePlan[],
        id?: string
    ) {}
}

export class CoveragePlan {
    id: string;
    name: string;
    capPerVisit: number;
    capPerYear: number;
    copayment: boolean;
    copaymentPercentage: number;
    code: string;
    remarks: string;
    constructor(
        id: string,
        name: string,
        capPerVisit: number,
        capPerYear: number,
        copayment: boolean,
        copaymentPercentage: number,
        code: string,
        remarks: string
    ) {}
}
