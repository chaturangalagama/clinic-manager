export class Uom {
  uom: string;
  multiply: number;

  constructor(uom: string = '', multiply: number = 1) {
    this.uom = uom;
    this.multiply = multiply;
  }
}
