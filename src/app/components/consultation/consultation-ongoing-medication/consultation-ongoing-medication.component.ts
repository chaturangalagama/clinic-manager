import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { OngoingMedicationItemComponent } from './ongoing-medication-item/ongoing-medication-item.component';
import { Component, OnInit, Input} from '@angular/core';
@Component({
  selector: 'app-consultation-ongoing-medication',
  templateUrl: './consultation-ongoing-medication.component.html',
  styleUrls: ['./consultation-ongoing-medication.component.scss']
})
export class ConsultationOngoingMedicationComponent implements OnInit {

  @Input() needRefresh: Subject<boolean>;
  itemFormGroup: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.itemFormGroup = this.fb.group({
      itemsFormArray : this.fb.array([])
    });
  }
    
  onBtnAddClicked(){
    this.addItem();
  }

  addItem(){
    const item = this.fb.group({
      itemCode: '123',
      medicationName:'123',
      type:'123',
      startDate:'123'
    });

    const formArray = <FormArray>this.itemFormGroup.get('itemsFormArray');
    formArray.push(item);
    console.log("formArray form: ",formArray);
  }
}
  

