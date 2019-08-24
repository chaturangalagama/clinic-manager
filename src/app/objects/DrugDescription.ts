import { FormGroup, FormControl } from '@angular/forms';
export interface TopDrugDescription {
  charge: string;
  qty?: string;
  uom?: string;
  sig: string;
  cautionary?: string;
  remarks: string;
  dosageInstruction?: string;
}

export class TopDrugDescriptionFormGroup {
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
