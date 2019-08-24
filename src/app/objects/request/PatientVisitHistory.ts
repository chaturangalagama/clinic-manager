import { DispatchDrugDetail } from './DrugDispatch';
import { AttachedMedicalCoverage } from '../AttachedMedicalCoverage';

export class PatientVisitHistory {
  consultation: Consultation;
  diagnoses: Diagnosis[];
  billPayment: BillPayment;
  fileMetaData: Array<FileMetaData>;
  patientVisitId: string;

  constructor(
    consultation?: Consultation,
    diagnoses?: Diagnosis[],
    billPayment?: BillPayment,
    fileMetaData?: Array<FileMetaData>,
    patientVisitId?: string
  ) {
    this.consultation = consultation || new Consultation();
    this.diagnoses = diagnoses || new Array<Diagnosis>();
    this.billPayment = billPayment || new BillPayment();
    this.fileMetaData = fileMetaData === undefined ? null : fileMetaData;
    this.patientVisitId = patientVisitId || '';
  }
}

class BillPayment {
  id: string;
  paymentStatus: string;
  patientVisitId: string;
  patientId: string;
  clinicId: string;
  gstValue: number;
  drugs: Drug[];
  medicalServices: Drug[];
  medicalTests: Drug[];
  vaccinations: Drug[];
  billId: string[];
  billPaymentTime: string;

  constructor(
    id?: string,
    paymentStatus?: string,
    patientVisitId?: string,
    patientId?: string,
    clinicId?: string,
    gstValue?: number,
    drugs?: Drug[],
    medicalServices?: Drug[],
    medicalTests?: Drug[],
    vaccinations?: Drug[],
    billId?: string[],
    billPaymentTime?: string
  ) {
    this.id = id || '';
    this.paymentStatus = paymentStatus || '';
    this.patientVisitId = patientVisitId || '';
    this.patientId = patientId || '';
    this.clinicId = clinicId || '';
    this.gstValue = gstValue === undefined ? 0 : gstValue;
    this.drugs = drugs || new Array<Drug>();
    this.medicalServices = medicalServices || new Array<Drug>();
    this.medicalTests = medicalTests || new Array<Drug>();
    this.vaccinations = vaccinations || new Array<Drug>();
    this.billId = billId || new Array<string>();
    this.billPaymentTime = billPaymentTime || '';
  }
}

class Drug {
  itemId: string;
  quantity: number;
  singleUnitPrice: number;
  userPayablePricePerUnit: number;
  gstAmountPerUnit: number;
  totalUserPayable: number;
  totalGst: number;
  copayAmount: number;
  paymentMode: string;

  constructor(
    itemId?: string,
    quantity?: number,
    singleUnitPrice?: number,
    userPayablePricePerUnit?: number,
    gstAmountPerUnit?: number,
    totalUserPayable?: number,
    totalGst?: number,
    copayAmount?: number,
    paymentMode?: string
  ) {
    this.itemId = itemId || '';
    this.quantity = quantity === undefined ? 0 : quantity;
    this.singleUnitPrice = singleUnitPrice ? 0 : singleUnitPrice;
    this.userPayablePricePerUnit = userPayablePricePerUnit === undefined ? 0 : userPayablePricePerUnit;
    this.gstAmountPerUnit = gstAmountPerUnit === undefined ? 0 : gstAmountPerUnit;
    this.totalUserPayable = totalUserPayable === undefined ? 0 : totalUserPayable;
    this.totalGst = totalGst === undefined ? 0 : totalGst;
    this.copayAmount = copayAmount === undefined ? 0 : copayAmount;
    this.paymentMode = paymentMode || '';
  }
}

class Diagnosis {
  id: string;
  icd10Id: string;
  snomedId: string;
  icd10Code: string;
  snomedCode: string;
  icd10Term: string;
  snomedTerm: string;
  status: string;

  constructor(
    id?: string,
    icd10Id?: string,
    snomedId?: string,
    icd10Code?: string,
    snomedCode?: string,
    icd10Term?: string,
    snomedTerm?: string,
    status?: string
  ) {
    this.id = id || '';
    this.icd10Id = icd10Id || '';
    this.snomedId = snomedId || '';
    this.icd10Code = icd10Code || '';
    this.snomedCode = snomedCode || '';
    this.icd10Term = icd10Term || '';
    this.snomedTerm = snomedTerm || '';
    this.status = status || '';
  }
}

class Consultation {
  id: string;
  patientId: string;
  medicalServiceGiven: MedicalServiceGiven[];
  immunisation: Immunisation[];
  documentStorage: DocumentStorage[];
  medicalCertificates: MedicalCertificate[];
  consultationNotes: string;
  doctorId: string;
  consultationStartTime: string;
  consultationEndTime: string;
  patientReferral: PatientReferral;
  drugDispatch: DrugDispatch;
  issuedMedicalTest: IssuedMedicalTest;
  diagnosisIds: string[];

  constructor(
    id?: string,
    patientId?: string,
    medicalServiceGiven?: MedicalServiceGiven[],
    immunisation?: Immunisation[],
    documentStorage?: DocumentStorage[],
    medicalCertificates?: MedicalCertificate[],
    consultationNotes?: string,
    doctorId?: string,
    consultationStartTime?: string,
    consultationEndTime?: string,
    patientReferral?: PatientReferral,
    drugDispatch?: DrugDispatch,
    issuedMedicalTest?: IssuedMedicalTest,
    diagnosisIds?: string[]
  ) {
    this.id = id || '';
    this.patientId = patientId || '';
    this.medicalServiceGiven = medicalServiceGiven || new Array<MedicalServiceGiven>();
    this.immunisation = immunisation || new Array<Immunisation>();
    this.documentStorage = documentStorage || new Array<DocumentStorage>();
    this.medicalCertificates = medicalCertificates || new Array<MedicalCertificate>();
    this.consultationNotes = consultationNotes || '';
    this.doctorId = doctorId || '';
    this.consultationStartTime = consultationStartTime || '';
    this.consultationEndTime = consultationEndTime || '';
    this.patientReferral = patientReferral || new PatientReferral();
    this.drugDispatch = drugDispatch || new DrugDispatch();
    this.issuedMedicalTest = issuedMedicalTest || new IssuedMedicalTest();
    this.diagnosisIds = diagnosisIds || new Array<string>();
  }
}

class IssuedMedicalTest {
  id: string;
  issuedMedicalTestDetails: IssuedMedicalTestDetail[];

  constructor(id?: string, issuedMedicalTestDetails?: IssuedMedicalTestDetail[]) {
    (this.id = id || ''),
      (this.issuedMedicalTestDetails = issuedMedicalTestDetails || new Array<IssuedMedicalTestDetail>());
  }
}

interface IssuedMedicalTestDetail {
  testId: string;
  suggestedLocation: string;
  priceAdjustment: DiscountGiven;
  attachedMedicalCoverages: AttachedMedicalCoverages;
}

class DrugDispatch {
  id: string;
  dispatchDrugDetail: DispatchDrugDetail[];

  constructor(id?: string, dispatchDrugDetail?: DispatchDrugDetail[]) {
    this.id = id || '';
    this.dispatchDrugDetail = dispatchDrugDetail || new Array<DispatchDrugDetail>();
  }
}

// interface DispatchDrugDetail {
//     drugId: string;
//     name: string;
//     dose: Dose;
//     instruction: Instruction;
//     batchNumber: string;
//     expiryDate: string;
//     remark: string;
//     duration: number;
//     userPaymentOption: DiscountGiven;
//     attachedMedicalCoverages: AttachedMedicalCoverages;
// }

interface Instruction {
  code: string;
  frequencyPerDay: number;
  instruct: string;
}

interface Dose {
  uom: string;
  quantity: number;
}

class PatientReferral {
  id: string;
  practice: string;
  clinicId: string;
  doctorId: string;
  appointmentDateTime: string;
  memo: string;

  constructor(
    id?: string,
    practice?: string,
    clinicId?: string,
    doctorId?: string,
    appointmentDateTime?: string,
    memo?: string
  ) {
    this.id = id || '';
    this.practice = practice || '';
    this.clinicId = clinicId || '';
    this.doctorId = doctorId || '';
    this.appointmentDateTime = appointmentDateTime || '';
    this.memo = memo || '';
  }
}

interface MedicalCertificate {
  purpose: string;
  startDate: string;
  numberOfDays: number;
}

class DocumentStorage {
  id: string;
  name: string;
  description: string;

  constructor(id?: string, name?: string, description?: string) {
    this.id = id || '';
    this.name = name || '';
    this.description = description || '';
  }
}

interface Immunisation {
  immunisationDate: string;
  batchNumber: string;
  nextDose: string;
  priceAdjustment: DiscountGiven;
  vaccinationId: string;
  doseId: string;
  chargeAmount: ChargeAmount;
  availablePriceAdjustment: DiscountGiven;
  attachedMedicalCoverages: AttachedMedicalCoverages;
}

interface MedicalServiceGiven {
  serviceId: string;
  serviceItemId: string;
  priceAdjustment: DiscountGiven;
  name: string;
  chargeAmount: ChargeAmount;
  availablePriceAdjustment: DiscountGiven;
  attachedMedicalCoverages: AttachedMedicalCoverages;
}

interface AttachedMedicalCoverages {
  medicalCoverageId: string;
  planId: string;
}

class ChargeAmount {
  price: number;
  taxIncluded: boolean;

  constructor(price: number, taxIncluded: boolean) {
    this.price = price === undefined ? 0 : this.price;
    this.taxIncluded = !!taxIncluded;
  }
}

class DiscountGiven {
  decreaseValue: number;
  increaseValue: number;
  paymentType: string;

  constructor(decreaseValue: number, increaseValue: number, paymentType: string) {
    this.decreaseValue = decreaseValue === undefined ? 0 : decreaseValue;
    this.increaseValue = increaseValue === undefined ? 0 : increaseValue;
    this.paymentType = paymentType || '';
  }
}

class FileMetaData {
  fileId: string;
  name: string;
  fileName: string;
  uploader: string;
  clinicId: string;
  type: string;
  size: number;
  description: string;

  constructor(
    fileId?: string,
    name?: string,
    fileName?: string,
    uploader?: string,
    clinicId?: string,
    type?: string,
    size?: number,
    description?: string
  ) {
    this.fileId = fileId || '';
    this.name = name || '';
    this.fileName = fileName || '';
    this.uploader = uploader || '';
    this.clinicId = clinicId || '';
    this.type = type || '';
    this.size = size === undefined ? 0 : size;
    this.description = description || '[';
  }
}
