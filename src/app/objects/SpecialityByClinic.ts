export interface Practice {
    practice: string;
    clinics: Clinic[];
}

export interface Clinic {
    clinicId: string;
    clinicCode: string;
    doctors: Doctor[];
}

export interface Doctor {
    id: string;
    name: string;
    education: string;
    doctorGroup: string;
    speciality: string;
    status?: string;
    mcr?: string;
}
