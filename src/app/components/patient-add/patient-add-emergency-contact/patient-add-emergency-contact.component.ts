import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl,Validators } from '@angular/forms';

@Component({
  selector: 'app-patient-add-emergency-contact',
  templateUrl: './patient-add-emergency-contact.component.html',
  styleUrls: ['./patient-add-emergency-contact.component.scss']
})
export class PatientAddEmergencyContactComponent implements OnInit {
@Input() emergencyContactFormGroup: FormGroup;

  constructor() { }

  ngOnInit() {
    this.subscribeOnChange();
  }

  subscribeOnChange(){
    this.emergencyContactFormGroup
      .valueChanges
      .pipe(debounceTime(50), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(values => {
        const relationshipFC = this.emergencyContactFormGroup
        .get('relationship');

        if (values.name || values.contact) {
          this.markRequiredAndTouched(relationshipFC);
        } else {
          this.clearRequiredAndTouched(relationshipFC);

          relationshipFC.patchValue(null);
        }
      });
  }

  markRequiredAndTouched(formControl: AbstractControl){
    formControl.setValidators(Validators.required);
    formControl.markAsTouched();
    formControl.updateValueAndValidity();
  }

  clearRequiredAndTouched(formControl: AbstractControl){
    formControl.clearValidators();
    formControl.markAsTouched();
    formControl.updateValueAndValidity();
  }

}
