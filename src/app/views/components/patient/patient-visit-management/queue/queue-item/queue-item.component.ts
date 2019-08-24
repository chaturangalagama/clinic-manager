import { DisplayHour } from './../../../../../../pipes/display-hour.pipe';
import { INPUT_DELAY } from './../../../../../../constants/app.constants';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AlertService } from './../../../../../../services/alert.service';
import { ApiPatientVisitService } from './../../../../../../services/api-patient-visit.service';
import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { StoreService } from '../../../../../../services/store.service';
@Component({
  selector: 'app-queue-item',
  templateUrl: './queue-item.component.html',
  styleUrls: ['./queue-item.component.scss']
})
export class QueueItemComponent implements OnInit {
  // isCollapsed;
  @Input() isQueueHidden;
  @Input() item;
  @Input() index;
  @Input() isCollapsed;

  @Output() itemClicked = new EventEmitter();
  constructor(private apiPatientVisitService: ApiPatientVisitService,
              private store: StoreService,
              private alertService: AlertService) { }

  ngOnInit() {
  }

  callThisPatient(){
    if(this.item.status ==="INITIAL"){
      this.apiPatientVisitService.consult(this.item.visitId, this.store.getUser().context['cms-user-id']).subscribe( res =>{
        if(res){
          const { payload }=res;
          this.item.visitId = payload.visitId;
          this.item.id = payload.patientId;
          this.item.status = payload.visitStatus;

          this.emitPatientInfo();
        }
      },
      err => this.alertService.error(JSON.stringify(err))
      );
    }
  }

  emitPatientInfo(){
    this.itemClicked.emit(this.item);
  }

  rowClicked(){
    this.emitPatientInfo();
  }

  getStatusColor(str){
    var className = 'text-';
    switch(str){
      case 'PRECONSULT':
        className += 'vivid-purple';
        break;
      case 'CONSULT':
        className += 'squash';
        break;
      case 'POSTCONSULT':
        className += 'cerulean';
        break;
    }
    return className;
  }
  
  getItemRowClass(){
    var className = 'list-group-item';
    if(!this.isCollapsed){
      className += ' selected';
    }

    if(this.index%2!=0){
      return className + ' item-odd';
    } else {
      return className + ' item-even';
    }
  }

  getCallButtonClass(){
    let baseClass = 'text-center text-white queue-call-button';
    return (this.item.status === "INITIAL") ? baseClass + ' cursor-pointer bg-brand-secondary ' : baseClass + ' bg-warm-grey '
  }




}
