import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-patient-medical-services',
  templateUrl: './patient-medical-services.component.html',
  styleUrls: ['./patient-medical-services.component.scss']
})
export class PatientMedicalServicesComponent implements OnInit {
  @Input() consultationFormGroup: FormGroup;

  constructor() { }

  ngOnInit() {
    console.log("medical services chargeformGroup: ",this.consultationFormGroup);


    // this.consultationFormGroup.get('consultation').get('memo').valueChanges
    // .pipe(distinctUntilChanged((a, b) => {
    //   return a=== b;
    // }), debounceTime(100)).subscribe( res =>{
    //   let tempMemo: string = res;
    //   tempMemo = tempMemo ? tempMemo.replace(/<p>&nbsp;<\/p>/g, '') : '';
    //   // this.consultationFormGroup.get('consultation').get('memo').patchValue(tempMemo);

    // });
  }
}
