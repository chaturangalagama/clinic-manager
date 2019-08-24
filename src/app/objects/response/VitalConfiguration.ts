export class VitalConfiguration {
  code: string;
  name: string;
  uom: string;
  disabled: boolean;

  constructor(code?: string, name?: string, uom?: string, disabled?: boolean) {
    this.code = code || '';
    this.name = name || '';
    this.uom = uom || '';
    this.disabled = disabled === undefined ? false : disabled;
  }
}
