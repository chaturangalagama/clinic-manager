import { FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
// TODO: make sure it is working with FormGroup

/**
 *
 *
 * @export
 * @param {FormGroup} group
 * @returns {null|Object} Null if valid.
 */
export function AtLeastOneFieldValidator(group: FormGroup): { [key: string]: any } {
  let isAtLeastOne = false;
  if (group && group.controls) {
    // console.log('Controls', group);
    for (const control in group.controls) {
      if (group.controls[control] instanceof FormGroup) {
        // AtLeastOneFieldValidator(<FormGroup>group.controls[control]);
        // isAtLeastOne = group.controls[control].valid;

        isAtLeastOne = AtLeastOneFieldValidator(<FormGroup>group.controls[control]) ? false : true;
        continue;
      }

      if (group.controls.hasOwnProperty(control) && group.controls[control].valid && group.controls[control].value) {
        console.log('Control', control);
        isAtLeastOne = true;
        break;
      }
    }
  }
  return isAtLeastOne ? null : { required: true };
}

// export function AtLeastOneFieldValidator(group: FormGroup): ValidatorFn {
//   return (control: AbstractControl): { [key: string]: any } => {
//     let isAtLeastOne = false;
//     if (group && group.controls) {
//       for (const subControl in group.controls) {
//         if (
//           group.controls.hasOwnProperty(subControl) &&
//           group.controls[subControl].valid &&
//           group.controls[subControl].value
//         ) {
//           console.log('Control', subControl);
//           isAtLeastOne = true;
//           break;
//         }
//       }
//     }
//     return isAtLeastOne ? null : { required: true };
//   };
// }
