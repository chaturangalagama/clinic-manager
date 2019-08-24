export interface PatientReferrals {
  patientReferrals: Array<PatientReferral>;
}

export interface PatientReferral {
  practice: string;
  clinicId: string;
  doctorId: string;
  appointmentDateTime: string;
  memo: string;
  externalReferral: true;
  externalReferralDetails: externalReferralDetails;
}

export interface externalReferralDetails {
  doctorName: string;
  address: string;
  phoneNumber: string;
}
