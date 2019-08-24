import { FormGroup, FormControl } from '@angular/forms';
export class ChargeItemDescription {
  charge: string;
  qty?: string;
  uom?: string;
  sig: string;
  cautionary?: string;
  remarks: string;
  dosageInstruction?: string;
}

export class ChargeItemDescriptionFormGroup {
  static getFormGroup() {
    return new FormGroup({
      charge: new FormControl(),
      qty: new FormControl(),
      uom: new FormControl(),
      sig: new FormControl(),
      cautionary: new FormControl(),
      remarks: new FormControl(),
      dosageInstruction: new FormControl()
    });
  }
}
