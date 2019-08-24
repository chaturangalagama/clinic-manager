export class MedicalCoverageResponse {
  INSURANCE: Array<Insurance>;
  CORPORATE: Array<Insurance>;
  CHAS: Array<Insurance>;
  MEDISAVE: Array<Insurance>;

  constructor(
    INSURANCE?: Array<Insurance>,
    CORPORATE?: Array<Insurance>,
    CHAS?: Array<Insurance>,
    MEDISAVE?: Array<Insurance>
  ) {
    this.INSURANCE = INSURANCE === undefined ? new Array<Insurance>() : INSURANCE;
    this.CORPORATE = CORPORATE === undefined ? new Array<Insurance>() : CORPORATE;
    this.CHAS = CHAS === undefined ? new Array<Insurance>() : CHAS;
    this.MEDISAVE = MEDISAVE === undefined ? new Array<Insurance>() : MEDISAVE;
  }
}

export class Insurance {
  policyHolder?: PolicyHolder;
  coveragePlan?: CoveragePlan;
  contacts?: Array<Contact>;
  address?: Address;
  medicalCoverageName?: string;

  constructor(
    policyHolder?: PolicyHolder,
    coveragePlan?: CoveragePlan,
    contacts?: Array<Contact>,
    address?: Address,
    medicalCoverageName?: string
  ) {
    this.policyHolder = policyHolder === undefined ? new PolicyHolder() : policyHolder;
    this.coveragePlan = coveragePlan === undefined ? new CoveragePlan() : coveragePlan;
    this.contacts = contacts === undefined ? new Array<Contact>() : contacts;
    this.address = address === undefined ? new Address() : address;
    this.medicalCoverageName = medicalCoverageName || '';
  }
}

export class CoveragePlan {
  id: string;
  name: string;
  capPerVisit: CapPerVisit;
  capPerWeek: CapPerVisit;
  capPerMonth: CapPerVisit;
  capPerYear: CapPerVisit;
  capPerLifeTime: CapPerVisit;
  copayment: Copayment;
  limitResetType: string;
  code: string;
  remarks: string;
  clinicRemarks: string;
  registrationRemarks: string;
  paymentRemarks: string;
  excludedClinics: any[];
  excludeAllByDefault: boolean;
  includedMedicalServiceSchemes: any[];
  excludedMedicalServiceSchemes: any[];
  allowedRelationship: any[];

  constructor(
    id?: string,
    name?: string,
    capPerVisit?: CapPerVisit,
    capPerWeek?: CapPerVisit,
    capPerMonth?: CapPerVisit,
    capPerYear?: CapPerVisit,
    capPerLifeTime?: CapPerVisit,
    copayment?: Copayment,
    limitResetType?: string,
    code?: string,
    remarks?: string,
    clinicRemarks?: string,
    registrationRemarks?: string,
    paymentRemarks?: string,
    excludedClinics?: any[],
    excludeAllByDefault?: boolean,
    includedMedicalServiceSchemes?: any[],
    excludedMedicalServiceSchemes?: any[],
    allowedRelationship?: any[]
  ) {
    this.id = id || '';
    this.name = name || '';
    this.capPerVisit = capPerVisit || new CapPerVisit();
    this.capPerWeek = capPerWeek || new CapPerVisit();
    this.capPerMonth = capPerMonth || new CapPerVisit();
    this.capPerYear = capPerYear || new CapPerVisit();
    this.capPerLifeTime = capPerLifeTime || new CapPerVisit();
    this.copayment = copayment || new Copayment();

    this.limitResetType = limitResetType || '';
    this.code = code || '';
    this.remarks = remarks || '';
    this.clinicRemarks = clinicRemarks || '';
    this.registrationRemarks = registrationRemarks || '';
    (this.paymentRemarks = paymentRemarks || ''),
      (this.excludedClinics = excludedClinics || new Array()),
      (this.excludeAllByDefault = excludeAllByDefault || false),
      (this.includedMedicalServiceSchemes = includedMedicalServiceSchemes || new Array()),
      (this.excludedMedicalServiceSchemes = excludedMedicalServiceSchemes || new Array()),
      (this.allowedRelationship = allowedRelationship || new Array());
  }
}

export class PolicyHolder {
  id?: string;
  identificationNumber: IdentificationNumber;
  name: string;
  medicalCoverageId: string;
  planId: string;
  patientCoverageId: string;
  specialRemarks: string;
  status: string;
  startDate: string;
  endDate: string;
  costCenter: string;

  constructor(
    id?: string,
    identificationNumber?: IdentificationNumber,
    name?: string,
    medicalCoverageId?: string,
    planId?: string,
    patientCoverageId?: string,
    specialRemarks?: string,
    status?: string,
    startDate?: string,
    endDate?: string,
    costCenter?: string
  ) {
    this.id = id || '';
    this.identificationNumber = identificationNumber || new IdentificationNumber();
    this.name = name || '';
    this.medicalCoverageId = medicalCoverageId || '';
    this.planId = planId || '';
    this.patientCoverageId = patientCoverageId || '';
    this.specialRemarks = specialRemarks || '';
    this.status = status || '';
    this.startDate = startDate || '';
    this.endDate = endDate || '';
    this.costCenter = costCenter || '';
  }
}

class Copayment {
  value?: number;
  paymentType?: string;

  constructor(value?: number, paymentType?: string) {
    this.value = value || 0;
    this.paymentType = paymentType || '';
  }
}

class CapPerVisit {
  visits?: number;
  limit?: number;

  constructor(visits?: number, limit?: number) {
    this.visits = visits || 0;
    this.limit = limit || 0;
  }
}

class IdentificationNumber {
  idType: string;
  number: string;

  constructor(idType?: string, number?: string) {
    this.idType = idType || '';
    this.number = number || '';
  }
}

export class Contact {
  name: string;
  title: string;
  directNumber: string;
  faxNumber: string;
  email: string;

  construtor(name?: string, title?: string, directNumber?: string, faxNumber?: string, email?: string) {
    this.name = name || '';
    this.title = title || '';
    this.directNumber = directNumber || '';
    this.faxNumber = faxNumber || '';
    this.email = email || '';
  }
}

export class Address {
  attentionTo?: string;
  address?: string;
  postalCode?: string;

  constructor(attentionTo?: string, address?: string, postalCode?: string) {
    this.attentionTo = attentionTo || '';
    this.address = address || '';
    this.postalCode = postalCode || '';
  }
}
// class Insurance {
//     id: string;
//     identificationNumber: IdentificationNumber;
//     name: string;
//     medicalCoverageId: string;
//     planId: string;
//     patientCoverageId: string;
//     specialRemarks: string;
//     status: string;
//     startDate: string;
//     endDate: string;

//     constructor(
//         id?: string,
//         identificationNumber?: IdentificationNumber,
//         name?: string,
//         medicalCoverageId?: string,
//         planId?: string,
//         patientCoverageId?: string,
//         specialRemarks?: string,
//         status?: string,
//         startDate?: string,
//         endDate?: string
//     ) {
//         this.id = id || '';
//         this.identificationNumber =
//             identificationNumber || new IdentificationNumber();
//         this.name = name || '';
//         this.medicalCoverageId = medicalCoverageId || '';
//         this.planId = planId || '';
//         this.patientCoverageId = patientCoverageId || '';
//         this.specialRemarks = specialRemarks || '';
//         this.status = status || '';
//         this.startDate = startDate || '';
//         this.endDate = endDate || '';
//     }
// }
