import { Contact } from './UserRegistration';
import { UserId } from './UserRegistrationObject';
export interface SelectedPlans {
  isSelected: false;
  coverageSelected: MedicalCoverageSelected;
  employeeNo: number;
  planRows: '';
  planSelected: CoverageSelected;
}

export class SelectedPlan {
  medicalCoverageId: string;
  patientCoverageId: string;
  planRows: string;
  planId: string;
  coverageSelected: MedicalCoverageSelected;
  planSelected: CoverageSelected;
  costCenter: string;
  coverageType: string;
  startDate: string;
  endDate: string;
  isNew: boolean;
  isSelected: boolean;
  remarks: string; 

  constructor(
    isSelected?: boolean,
    medicalCoverageId?: string,
    patientCoverageId?: string,
    planRows?: string,
    planId?: string,
    coverageSelected?: MedicalCoverageSelected,
    planSelected?: CoverageSelected,
    costCenter?: string,
    coverageType?: string,
    startDate?: string,
    endDate?: string,
    isNew?: boolean,
    remarks?: string
  ) {
    this.isSelected = isSelected === undefined ? false : isSelected;
    this.medicalCoverageId = medicalCoverageId || '';
    this.patientCoverageId = patientCoverageId || '';
    this.planRows = planRows || '';
    this.planId = planId || '';
    this.coverageSelected = coverageSelected === undefined ? new MedicalCoverageSelected() : coverageSelected;
    this.planSelected = planSelected === undefined ? new CoverageSelected() : planSelected;
    this.costCenter = costCenter || '';
    this.coverageType = coverageType || '';
    this.startDate = startDate || '';
    this.endDate = endDate || '';
    this.isNew = isNew === undefined ? false : isNew;
    this.remarks = remarks || '';
  }
}

export class MedicalCoverageSelected {
  id: string;
  name: string;
  code: string;
  accountManager: string;
  type: string;
  startDate: string;
  endDate: string;
  creditTerms: number;
  payAtClinic?: boolean;
  policyHolderCount?: number;
  website: string;
  trackAttendance: boolean;
  usePatientAddressForBilling: boolean;
  medicineRefillAllowed: boolean;
  showDiscount: boolean;
  showMemberCard: boolean;
  address: Address;
  contacts: ContactPerson[];
  status?: string;
  coveragePlans?: CoverageSelected[];
  costCenters?: Array<any>;
  costCenter?: string;

  constructor(
    id?: string,
    name?: string,
    code?: string,
    accountManager?: string,
    type?: string,
    startDate?: string,
    endDate?: string,
    creditTerms?: number,
    payAtClinic?: boolean,
    policyHolderCount?: number,
    website?: string,
    trackAttendance?: boolean,
    usePatientAddressForBilling?: boolean,
    medicineRefillAllowed?: boolean,
    showDiscount?: boolean,
    showMemberCard?: boolean,
    address?: Address,
    contacts?: ContactPerson[],
    status?: string,
    coveragePlans?: CoverageSelected[],
    costCenters?: Array<any>,
    costCenter?: string
  ) {
    this.id = id || '';
    this.name = name || '';
    this.code = code || '';
    this.accountManager = accountManager || '';
    this.type = type || '';
    this.startDate = startDate || '';
    this.endDate = endDate || '';
    this.creditTerms = creditTerms === undefined ? 0 : creditTerms;
    this.payAtClinic = payAtClinic === undefined ? false : payAtClinic;
    this.policyHolderCount = policyHolderCount === undefined ? 0 : policyHolderCount;
    this.website = website || '';
    this.trackAttendance = trackAttendance === undefined ? false : trackAttendance;
    this.usePatientAddressForBilling = usePatientAddressForBilling === undefined ? false : usePatientAddressForBilling;
    this.medicineRefillAllowed = medicineRefillAllowed === undefined ? false : medicineRefillAllowed;
    this.showDiscount = showDiscount === undefined ? false : showDiscount;
    this.showMemberCard = showMemberCard === undefined ? false : showMemberCard;
    this.address = address === undefined ? new Address() : address;
    this.contacts = contacts === undefined ? new Array<ContactPerson>() : contacts;
    this.status = status || '';
    this.coveragePlans = coveragePlans === undefined ? new Array<CoverageSelected>() : coveragePlans;
    this.costCenters = costCenters === undefined ? [] : costCenters;
    this.costCenter = costCenter || '';
  }
}

export class CoverageSelected {
  id?: string;
  name?: string;
  capPerVisit?: CapPerVisit;
  capPerDay?: CapPerVisit;
  capPerWeek?: CapPerVisit;
  capPerMonth?: CapPerVisit;
  capPerYear?: CapPerVisit;
  capPerLifeTime?: CapPerVisit;
  copayment?: Copayment;
  limitResetType?: string;
  code?: string;
  startDate?: string;
  endDate?: string;
  remarks?: string;
  clinicRemarks?: string;
  registrationRemarks?: string;
  paymentRemarks?: string;
  excludedClinics?: any[];
  excludeAllByDefault?: boolean;
  includedMedicalServiceSchemes?: any[];
  excludedMedicalServiceSchemes?: any[];
  allowedRelationship?: any[];

  constructor(
    id?: string,
    name?: string,
    capPerVisit?: CapPerVisit,
    capPerDay?: CapPerVisit,
    capPerWeek?: CapPerVisit,
    capPerMonth?: CapPerVisit,
    capPerYear?: CapPerVisit,
    capPerLifeTime?: CapPerVisit,
    copayment?: Copayment,
    limitResetType?: string,
    code?: string,
    startDate?: string,
    endDate?: string,
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
    this.capPerDay = capPerDay || new CapPerVisit();
    this.capPerWeek = capPerWeek || new CapPerVisit();
    this.capPerMonth = capPerMonth || new CapPerVisit();
    this.capPerYear = capPerYear || new CapPerVisit();
    this.capPerLifeTime = capPerLifeTime || new CapPerVisit();
    this.copayment = copayment || new Copayment();

    this.limitResetType = limitResetType || '';
    this.code = code || '';
    this.startDate = startDate || '';
    this.endDate = endDate || '';
    this.remarks = remarks || '';
    this.clinicRemarks = clinicRemarks || '';
    this.registrationRemarks = registrationRemarks || '';
    this.paymentRemarks = paymentRemarks || '';
    this.excludedClinics = excludedClinics || new Array();
    this.excludeAllByDefault = excludeAllByDefault || false;
    this.includedMedicalServiceSchemes = includedMedicalServiceSchemes || new Array();
    this.excludedMedicalServiceSchemes = excludedMedicalServiceSchemes || new Array();
    this.allowedRelationship = allowedRelationship || new Array();
  }
}

export interface IncludedMedicalServiceScheme {
  medicalServiceItemID: string;
}

export class Copayment {
  value?: number;
  paymentType?: string;

  constructor(value?: number, paymentType?: string) {
    this.value = value || 0;
    this.paymentType = paymentType || '';
  }
}

export class CapPerVisit {
  visits?: number;
  limit?: number;

  constructor(visits?: number, limit?: number) {
    this.visits = visits || 0;
    this.limit = limit || 0;
  }
}

export class ContactPerson {
  name: string;
  title: string;
  directNumber: string;
  mobileNumber: string;
  faxNumber: string;
  email: string;

  constructor(
    name?: string,
    title?: string,
    directNumber?: string,
    mobileNumber?: string,
    faxNumber?: string,
    email?: string
  ) {
    this.name = name || '';
    this.title = title || '';
    this.directNumber = directNumber || '';
    this.mobileNumber = mobileNumber || '';
    this.faxNumber = faxNumber || '';
    this.email = email || '';
  }
}

export class Address {
  attentionTo: string;
  street: string;
  unit: string;
  postalCode: string;

  constructor(attentionTo?: string, street?: string, unit?: string, postalCode?: string) {
    this.attentionTo = attentionTo || '';
    this.street = street || '';
    this.unit = unit || '';
    this.postalCode = postalCode || '';
  }
}

export class PolicyHolderInfo {
  id: string;
  identificationNumber: UserId;
  name: string;
  medicalCoverageId: string;
  planId: string;
  patientCoverageId: string;
  specialRemarks: string;
  costCenter: string;
  status: string;
  startDate: string;
  endDate: string;

  constructor(
    id?: string,
    identificationNumber?: UserId,
    name?: string,
    medicalCoverageId?: string,
    planId?: string,
    patientCoverageId?: string,
    specialRemarks?: string,
    costCenter?: string,
    status?: string,
    startDate?: string,
    endDate?: string
  ) {
    this.id = id || '';
    this.identificationNumber = identificationNumber === undefined ? new UserId() : identificationNumber;
    this.name = name || '';
    this.medicalCoverageId = medicalCoverageId || '';
    this.planId = planId || '';
    this.patientCoverageId = patientCoverageId || '';
    this.specialRemarks = specialRemarks || '';
    this.costCenter = costCenter || '';
    this.status = status || '';
    this.startDate = startDate || '';
    this.endDate = endDate || '';
  }
}
