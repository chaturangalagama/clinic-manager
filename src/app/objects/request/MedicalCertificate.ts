export interface MedicalCertificate {
  purpose: string;
  startDate: string;
  numberOfDays: number;
  otherReason?: string;
  halfDayOption?: string;
}
