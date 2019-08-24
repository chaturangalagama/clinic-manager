export class VitalData {
  patientId?: string;
  vitalId?: string;
  private _code: string;

  public get code(): string {
    return this._code;
  }
  public set code(value: string) {
    this._code = value;
  }
  value: string;
  comment: string;

  constructor(patientId?: string, vitalId?: string, code?: string, value?: string, comment?: string) {
    this.patientId = patientId || '';
    this.vitalId = vitalId || '';
    this.code = code || '';
    this.value = value || '';
    this.comment = comment || '';
  }
}
