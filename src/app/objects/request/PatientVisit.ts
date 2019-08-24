import { AttachedMedicalCoverage } from '../AttachedMedicalCoverage';

export class PatientVisit {
  registryEntity: PatientVisitRegistryEntity;
  attachedMedicalCoverages: Array<string>;

  constructor(
    registryEntity: PatientVisitRegistryEntity = new PatientVisitRegistryEntity(),
    attachedMedicalCoverages: Array<string> = []
  ) {
    this.registryEntity = registryEntity;
    this.attachedMedicalCoverages = attachedMedicalCoverages;
  }
}

export class PatientVisitRegistryEntity {
  patientId: string;
  clinicId: string;
  preferredDoctorId: string;
  visitPurpose: string;
  priority: string;

  constructor(
    patientId: string = '',
    clinicId: string = '',
    preferredDoctorId: string = undefined,
    visitPurpose: string = '',
    priority: string = ''
  ) {
    this.patientId = patientId;
    this.clinicId = clinicId;
    this.preferredDoctorId = preferredDoctorId;
    this.visitPurpose = visitPurpose;
    this.priority = priority;
  }
}

export interface VisitPurpose {
  name: string;
  consultationRequired: boolean;
}
