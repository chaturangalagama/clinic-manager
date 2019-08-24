import { ConsultationFollowUpComponent } from './../../components/consultation/consultation-follow-up/consultation-follow-up.component';
import { IssuedMedicalTest } from './MedicalTest';
import { DocumentStorage } from './DocumentStorage';
import { MedicalServiceGiven } from './MedicalServiceGiven';
import { ImmunisationGiven } from './Immunisation';
import { MedicalCertificate } from './MedicalCertificate';
import { DrugDispatch, DispatchDrugDetail } from './DrugDispatch';
import { PatientReferral, PatientReferrals } from './PatientReferral';

export interface Consultation {
  id?: string;
  patientId?: string;
  medicalServiceGiven: MedicalServiceGiven;
  immunisationGiven: ImmunisationGiven;
  documentStorage: DocumentStorage[];
  medicalCertificates: MedicalCertificate[];
  memo?: string;
  consultationNotes?: string;
consultationStartTime: string;
  consultationEndTime: string;
  patientReferral?: PatientReferrals;
  // patientReferral?: PatientReferral;
  drugDispatch?: DrugDispatch;
  issuedMedicalTest?: IssuedMedicalTest;
  diagnosisIds: any[];
  followupConsultation?: FollowupConsultation;
}

interface FollowupConsultation {
  followupDate?: string;
  remarks?: string;
}
