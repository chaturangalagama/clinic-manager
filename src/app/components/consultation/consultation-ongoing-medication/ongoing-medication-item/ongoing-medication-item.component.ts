import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-ongoing-medication-item',
  templateUrl: './ongoing-medication-item.component.html',
  styleUrls: ['./ongoing-medication-item.component.scss']
})
export class OngoingMedicationItemComponent implements OnInit {
  @Input() item: FormGroup;

  constructor() { }

  ngOnInit() {
    console.log("ongoing item: ", this.item);
  }
}
