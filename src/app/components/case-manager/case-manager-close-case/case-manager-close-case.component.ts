import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { StoreService } from '../../../services/store.service';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { ApiCaseManagerService } from '../../../services/api-case-manager.service';

@Component({
  selector: 'app-case-manager-close-case',
  templateUrl: './case-manager-close-case.component.html',
  styleUrls: ['./case-manager-close-case.component.scss']
})
export class CaseManagerCloseCaseComponent implements OnInit {

  outstanding: string;
  caseId: string;
  title: string;
  message: string;

  constructor(
    private bsModalRef: BsModalRef,
    private store: StoreService,
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router,
    private apiCaseManagerService: ApiCaseManagerService
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

  closeCase() {
    console.log("Closing case ", this.caseId);
    this.apiCaseManagerService.closeCase(this.caseId).subscribe(data => {
      if (data.statusCode === 'S0000') {
        console.log("Closing case success");
        this.backToAllCases();
        this.bsModalRef.hide();
      } else {
        this.message = data.message;
      }
    },
      err => {
        this.alertService.error(JSON.stringify(err.error.message));
        this.message = err.error.message;
      });
  }

  backToAllCases() {
    this.router.navigate(['/pages/case/list']);
    return false;
  }

  hasOutstanding() {
    if (+this.outstanding > 0) {
      return true;
    }
    else
      false
  }

}
