export class VitalResponseData {
  patientId?: string;
  vitalId?: string;
  code: string;
  value: string;
  comment: string;
  takenTime: string;

  constructor(
    patientId?: string,
    vitalId?: string,
    code?: string,
    value?: string,
    comment?: string,
    takenTime?: string
  ) {
    this.patientId = patientId || '';
    this.vitalId = vitalId || '';
    this.code = code || '';
    this.value = value || '';
    this.comment = comment || '';
    this.takenTime = takenTime || '';
  }
}
