import { PatientNote } from './../../../../objects/response/PatientNote';
import { FormControl } from '@angular/forms';
import { StoreService } from './../../../../services/store.service';
import { ApiCmsManagementService } from './../../../../services/api-cms-management.service';
import { DisplayDatePipe } from './../../../../pipes/display-date.pipe';
import { Component, OnInit, Input, HostListener } from '@angular/core';
import { PatientNoteAdd } from '../../../../objects/request/PatientNoteAdd';

@Component({
  selector: 'app-problem-list-item',
  templateUrl: './problem-list-item.component.html',
  styleUrls: ['./problem-list-item.component.scss']
})
export class ProblemListItemComponent implements OnInit {

  @Input() item: PatientNote;

  editNote: FormControl;
  editMode: boolean;
  constructor(
    private apiCmsManagementService: ApiCmsManagementService,
    private store: StoreService
    ) 
  { }

  ngOnInit() {
    this.editMode = false;
    this.editNote = new FormControl();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {

    if(event.keyCode === 13){
      // this.modifyPatientNote();
    }
  }


  editNoteClicked(){
    this.editMode = true;
  }

  // deleteNoteClicked(){
  //   this.item.status = 'INACTIVE';
  //   this.apiCmsManagementService
  //     .modifyPatientNote(this.store.getPatientId(), this.item.id, this.item.status)
  //     .subscribe(
  //       res =>{
  //         console.log('Delete Note', res.payload);
  //       }
  //     );
  // }

  getDoctorName(doctorId: string): string {
    return (this.store.doctorList.find(doctor => doctor.id === doctorId) || { displayName: '' }).displayName;
  }

}
