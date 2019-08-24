export class UserRegistration {
    constructor(
        title: string,
        preferredMethodOfCommunication: string,
        name: string,
        dob: string,
        userId: UserId,
        gender: string,
        contactNumber: Contact,
        status: string,
        address: Address,
        emailAddress: string,
        emergencyContactNumber: EmergencyContactNumber,
        company: Company,
        nationality: string,
        maritalStatus: string,
        race: string,
        preferredLanguage: string,
        allergies: Object
    ) {}
}
export class Company {
  constructor(
        name: string,
        address: string,
        postalCode: number,
        occupation: string
    ) {}
}

export class UserId {
    constructor(idType: string, number: string) {}
}

export class Contact {

    constructor(countryCode: number, number: string) {}
}

export class EmergencyContactNumber {
    constructor(countryCode: number, number: string, name: string, relationship:string) {}
}

export class Address {
constructor(address: string, country: string, postalCode: string) {
    }
}
