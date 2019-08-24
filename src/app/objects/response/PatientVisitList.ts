export interface PatientVisitList {
    visitId: string;
    visitNumber: string;
    caseId: string;
    patientId: string;
    clinicId: string;
    preferredDoctorId: string;
    visitPurpose: string;
    priority: string;
    medicalReferenceEntity: MedicalReferenceEntity;
    visitStatus: string;
    attachedToCase: boolean;
    startTime: string;
    endTime: string;
  }
  
  export interface MedicalReferenceEntity {
    consultation: Consultation;
    diagnosisIds: string[];
    medicalCertificates: MedicalCertificate[];
    consultationFollowup: ConsultationFollowup;
    patientReferral: PatientReferral2;
    dispatchItemEntities: DispatchItemEntity[];
  }

  interface DispatchItemEntity {
    itemId: string;
    dosageUom: string;
    instruct: string;
    duration: number;
    dosage: number;
    quantity: number;
    oriTotalPrice: string;
    batchNo: string;
    expiryDate: string;
    remarks: string;
    itemPriceAdjustment: ItemPriceAdjustment;
    excludedCoveragePlanIds: string[];
  }
  
  interface ItemPriceAdjustment {
    adjustedValue: string;
    paymentType: string;
  }
  
  interface PatientReferral2 {
    referralId: string;
    patientReferrals: PatientReferral[];
  }
  
  interface PatientReferral {
    practice: string;
    externalReferral: boolean;
    externalReferralDetails: ExternalReferralDetails;
    clinicId: string;
    doctorId: string;
    appointmentDateTime: string;
    memo: string;
  }
  
  interface ExternalReferralDetails {
    doctorName: string;
    address: string;
    phoneNumber: string;
  }
  
  interface ConsultationFollowup {
    followupId: string;
    patientId: string;
    patientVisitId: string;
    doctorId: string;
    clinicId: string;
    followupDate: string;
    remarks: string;
    reminderStatus: ReminderStatus;
  }
  
  interface ReminderStatus {
    reminderSent: boolean;
    reminderSentTime: string;
    sentSuccessfully: boolean;
    remark: string;
    externalReferenceNumber: string;
  }
  
  interface MedicalCertificate {
    purpose: string;
    startDate: string;
    numberOfDays: number;
    referenceNumber: string;
    remark: string;
    halfDayOption: string;
  }
  
export interface Consultation {
    consultationId: string;
    patientId: string;
    consultationNotes: string;
    memo: string;
    clinicNotes: string;
    doctorId: string;
    clinicId: string;
    consultationStartTime: string;
    consultationEndTime: string;
  }