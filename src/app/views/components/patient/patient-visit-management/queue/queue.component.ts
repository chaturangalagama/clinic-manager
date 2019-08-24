import { AlertService } from './../../../../../services/alert.service';
import { INPUT_DELAY } from './../../../../../constants/app.constants';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ApiPatientVisitService } from './../../../../../services/api-patient-visit.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { StoreService } from '../../../../../services/store.service';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss']
})
export class QueueComponent implements OnInit {
  @Input() isQueueHidden: boolean;
  @Input() needRefresh: Subject<boolean>;
  @Output() onHide = new EventEmitter<boolean>();
  @Output() selectedPatient = new EventEmitter();
  selectedPatientIndex: string;

  // Header Attributes
  preConsultCount = 0;
  postConsultCount = 0;

  queueList = [];

  constructor(private apiPatientVisitService: ApiPatientVisitService,
              private store: StoreService,
              private alertService: AlertService) { }

  ngOnInit() {

    if(!this.selectedPatientIndex){
      this.selectedPatientIndex = this.store.getPatientVisitRegistryId();
      // this.getSelectedPatient();
   }
    this.getQueue();

    this.subscribeOnVisitIdChange();

    // this.subscribeOnRefresh();

   }

  getQueue(){
    this.queueList = [];
      this.apiPatientVisitService.listQueue(this.store.getClinicId()).pipe( debounceTime(INPUT_DELAY))
      .subscribe( res =>{
          console.log('queue res: ', res);
          const { payload } = res;
          payload.forEach( patient =>{
              const registryEntity = patient.registryEntity;
              const patientId = registryEntity.patientId;
              const patientName = patient.patientName;
              const userId = patient.userId;
              const patientQueue = registryEntity.patientQueue;
              const visitId = registryEntity.visitId;
              const queueItem = {
                "queueNumber": patientQueue? patientQueue.queueNumber : 'N/A',
                "caseId": registryEntity.caseId,
                "id": patientId,
                "userId": userId.idType + userId.number,
                "visitId": visitId,
                "name": patientName,
                "time": registryEntity.startTime,
                "status": registryEntity.visitStatus,
                "remarks": registryEntity.visitRemarks || '',
                "purpose": registryEntity.visitPurpose,
                "urgent": patientQueue ? patientQueue.urgent : false
              }
              this.queueList.push(queueItem);
          });
          this.getStatusCounts();
        },
        err => this.alertService.error(JSON.stringify(err))
      );
  }

  callNextPatient(){
    const event = { callNext: true};
    this.selectedPatient.emit(event);
  }

  subscribeOnVisitIdChange(){
    // this.queueList = [];
    this.store.getPatientVisitIdRefresh()
    .pipe(debounceTime(50), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
     .subscribe( visitId=>{
      if(visitId){
        this.selectedPatientIndex = visitId;
        this.getQueue();
      }
    });
  }

  subscribeOnRefresh(){
    // this.queueList = [];
    this.needRefresh.pipe(debounceTime(50), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
    .subscribe(res =>{
      this.getQueue();
    });
  }

  getStatusCounts(){
    this.preConsultCount = 0;
    this.postConsultCount = 0;

    if(this.queueList){
      this.queueList.forEach( patient =>{

        if(patient.status==="INITIAL"){
          this.preConsultCount++;
        }else if(patient.status==="POST_CONSULT"){
          this.postConsultCount++;
        }
      });
    }
  }

  reloadPatientDetails(event){
    this.selectedPatient.emit(event);
  }

  btnQueue() {
    this.isQueueHidden = !this.isQueueHidden;
    this.onHide.emit(this.isQueueHidden);
  }

  isSelected(index){
    if (index === this.selectedPatientIndex) {
      return false;
    } else {
      return true;
    }
  }
}
