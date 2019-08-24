import { Allergy } from './response/Allergy';
export class UserRegistrationObject {
  patientNumber: string;
  id: string;
  title: string;
  preferredMethodOfCommunication: string;
  consentGiven: boolean;
  name: string;
  dob: string;
  userId: UserId;
  gender: string;
  contactNumber: Contact;
  status: string;
  address: Address;
  emailAddress: string;
  emergencyContactNumber: EmergencyContactNumber;
  company: Company;
  nationality: string;
  maritalStatus: string;
  race: string;
  preferredLanguage: string;
  allergies: Array<Allergy>;
  remarks: string;
  companyId: string;
  constructor(
    patientNumber?: string,
    id?: string,
    title?: string,
    preferredMethodOfCommunication?: string,
    consentGiven?: boolean,
    name?: string,
    dob?: string,
    userId?: UserId,
    gender?: string,
    contactNumber?: Contact,
    status?: string,
    address?: Address,
    emailAddress?: string,
    emergencyContactNumber?: EmergencyContactNumber,
    company?: Company,
    nationality?: string,
    maritalStatus?: string,
    race?: string,
    preferredLanguage?: string,
    allergies?: Array<Allergy>,
    remarks?: string,
    companyId?: string
  ) {
    this.patientNumber = patientNumber || '-';
    this.id = id || '';
    this.title = title || '';
    this.preferredMethodOfCommunication = preferredMethodOfCommunication || '';
    this.consentGiven = consentGiven === undefined ? false : consentGiven;
    this.name = name || '';
    this.dob = dob || '';
    this.userId = userId === undefined ? new UserId() : userId;
    this.gender = gender || '';
    this.contactNumber = contactNumber === undefined ? new Contact() : contactNumber;
    this.status = status || '';
    this.address = address === undefined ? new Address() : address;
    this.emailAddress = emailAddress || '';
    this.emergencyContactNumber = emergencyContactNumber === undefined ? new EmergencyContactNumber() : emergencyContactNumber;
    this.company = company === undefined ? new Company() : company;
    this.nationality = nationality || '';
    this.maritalStatus = maritalStatus || '';
    this.race = race || '';
    this.preferredLanguage = preferredLanguage || '';
    this.allergies = allergies === undefined ? new Array<Allergy>() : allergies;
    this.remarks = remarks || '';
    this.companyId = companyId || '';
  }
}
export class Company {
  name: string;
  address: string;
  postalCode: string;
  occupation: string;
  constructor(name?: string, address?: string, postalCode?: string, occupation?: string) {
    this.name = name || '';
    this.address = address || '';
    this.postalCode = postalCode || '';
    this.occupation = occupation || '';
  }
}

export class UserId {
  idType: string;
  number: string;
  constructor(idType?: string, number?: string) {
    this.idType = idType || '';
    this.number = number || '';
  }
}

export class Contact {
  countryCode: number;
  number: string;
  constructor(countryCode?: number, number?: string) {
    this.countryCode = countryCode === undefined ? 0 : countryCode;
    this.number = number || '';
  }
}

export class EmergencyContactNumber {
  countryCode: number;
  number: string;
  name: string;
  relationship: string
  constructor(countryCode?: number, number?: string, name?: string,relationship?:string) {
    this.countryCode = countryCode === undefined ? 0 : countryCode;
    this.number = number || '';
    this.name = name || '';
    this.relationship = relationship || '';
  }
}

export class Address {
  address: string;
  country: string;
  postalCode: string;
  constructor(address?: string, country?: string, postalCode?: string) {
    this.address = address || '';
    this.country = country || '';
    this.postalCode = postalCode || '';
  }
}
