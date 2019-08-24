import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-clinic-notes',
  templateUrl: './clinic-notes.component.html',
  styleUrls: ['./clinic-notes.component.scss']
})
export class ClinicNotesComponent implements OnInit {
  @Input() clinicNotes: FormControl;
  @Input() isExpanded: boolean = true;

  constructor() { }

  ngOnInit() {
   }
}
