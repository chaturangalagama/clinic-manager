import { Component, OnInit, EventEmitter } from '@angular/core';
import { StoreService } from '../../../services/store.service';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap';
import { ApiPatientVisitService } from '../../../services/api-patient-visit.service';

@Component({
  selector: 'app-case-manager-delete-visit',
  templateUrl: './case-manager-delete-visit.component.html',
  styleUrls: ['./case-manager-delete-visit.component.scss']
})
export class CaseManagerDeleteVisitComponent implements OnInit {

  visitId: string;
  title: string;
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private store: StoreService,
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router,
    private bsModalRef: BsModalRef,
    private apiPatientVisitService: ApiPatientVisitService
  ) { }

  ngOnInit() {
    if (
      localStorage.getItem('access_token') &&
      localStorage.getItem('clinicCode') &&
      localStorage.getItem('clinicId')
    ) {
      this.store.clinicCode = localStorage.getItem('clinicCode');
      this.store.clinicId = localStorage.getItem('clinicId');
    } else {
      alert('Clinic is not selected.');
      localStorage.removeItem('access_token');
      this.authService.logout();

      console.log('Access Denied');
      this.router.navigate(['login']);
    }

    if (this.store.errorMessages.length > 0) {
      this.store.errorMessages.forEach(errorMsg1 => {
        console.log('ERROR MESSAGE: ', errorMsg1);
      });
    }
  }

  cancelModal() {
    this.bsModalRef.hide();
  }

  deleteVisit(){
    this.apiPatientVisitService.patientVisitRemove(this.visitId, this.store.getCaseId()).subscribe(data => {
      if (data) {
        if (data.statusCode === 'S0000') {
          console.log("Remove visit success -", this.visitId);
          this.event.emit('Refresh Case Details');
        } else {
          alert(data.message);
        }
        this.bsModalRef.hide();
      }
      return data;
    },
      err => {
        this.alertService.error(JSON.stringify(err.error.message));
      });
  }
}
