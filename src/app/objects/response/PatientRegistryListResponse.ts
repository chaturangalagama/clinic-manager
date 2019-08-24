export class PatientRegistryListResponse {
  name?: string;
  patientId?: string;
  patientRegistryId?: string;
  consultationId?: string;
  visitNumber?: string;
  visitId?: string;
  doctorsName?: string;
  userId?: UserId;
  visitStartTime?: string;
  purposeOfVisit?: string;
  remark?: string;
  visitState?: string;
  action?: string;
  doctorId?: string;

  constructor(
    name?: string,
    patientId?: string,
    patientRegistryId?: string,
    consultationId?: string,
    visitNumber?: string,
    visitId?: string,
    doctorsName?: string,
    userId?: UserId,
    visitStartTime?: string,
    purposeOfVisit?: string,
    remark?: string,
    visitState?: string,
    action?: string,
    doctorId?: string
  ) {
    this.name = name || '';
    this.patientId = patientId || '';
    this.patientRegistryId = patientRegistryId || '';
    this.userId = userId === undefined ? new UserId() : userId;
    this.visitStartTime = visitStartTime || '';
    this.visitId = visitId || '';
    this.purposeOfVisit = purposeOfVisit || '';
    this.remark = remark || '';
    this.visitState = visitState || '';
    this.action = action || '';
    this.visitNumber = visitNumber || '';
    this.consultationId = consultationId || '';
    this.doctorsName = doctorsName || '';
    this.doctorId = doctorId || '';
  }
}

export class UserId {
  idType?: string;
  number?: string;

  constructor(idType?: string, number?: string) {
    this.idType = idType || '';
    this.number = number || '';
  }
}
