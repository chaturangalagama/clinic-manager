import { distinctUntilChanged } from 'rxjs/operators';
import { DisplayDollarPipe } from './../../../pipes/display-dollar.pipe';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
@Component({
  selector: 'app-payment-coverage-limit',
  templateUrl: './payment-coverage-limit.component.html',
  styleUrls: ['./payment-coverage-limit.component.scss']
})
export class PaymentCoverageLimitComponent implements OnInit {
  @Input() coverageLimitFormGroup: FormGroup;
  updatedLimits: FormControl[];

  constructor() {}

  ngOnInit() {
    this.updatedLimits = [];

    this.displayUpdatedLimitOnInit();
  }

  displayUpdatedLimitOnInit(){
    const coverageArr = this.coverageLimitFormGroup.get('coverageLimitArray') as FormArray;
    coverageArr.valueChanges
    .pipe(distinctUntilChanged())
    .subscribe( value =>{
      
      this.updatedLimits = [];
      value.forEach( (coverage,index) =>{
        const standAloneLimitControl = new FormControl(this.convertToDollar(coverage.updatedLimit));
        this.subscribeChangesOnUpdatedLimit(standAloneLimitControl, index)
        this.updatedLimits.push(standAloneLimitControl);
      });
    });
  }

  subscribeChangesOnUpdatedLimit(updatedLimit: FormControl, index){
    const coverageArr = this.coverageLimitFormGroup.get('coverageLimitArray') as FormArray;
    const coverageFG = coverageArr.at(index) as FormGroup;

     updatedLimit.valueChanges.subscribe(value =>{
      const resToCents = this.convertToCents(value);
      coverageFG.get('updatedLimit').patchValue(resToCents);
      coverageFG.updateValueAndValidity();
     });
  }

  convertToDollar(value){
    return value/100;
  }

  convertToCents(value){
    return value*100.0;
  }
}
