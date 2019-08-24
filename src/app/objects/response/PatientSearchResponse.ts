export interface PatientSearchResponse {
    id: string;
    registrationDate: number;
    lastVisitedDate: number;
    name: string;
    dob: string;
    userId: UserId;
    gender: string;
    contactNumber: ContactNumber;
    status: string;
    address: Address;
    emailAddress: string;
    emergencyContactNumber: ContactNumber;
    nationality: string;
    maritalStatus: string;
    remarks: string;
}

interface Address {
    address: string;
    country: string;
    postalCode: string;
}

interface ContactNumber {
    countryCode: number;
    number: string;
}

interface UserId {
    idType: string;
    number: string;
}
