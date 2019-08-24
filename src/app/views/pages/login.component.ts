import { JwtHelperService } from '@auth0/angular-jwt';
import { StoreService } from './../../services/store.service';
import { HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { UserLogin } from './../../objects/User';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ClinicSelectComponent } from '../components/clinic/clinic-select/clinic-select.component';
import { Validators, AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  username: string;
  password: string;
  clinic: string;

  clinicList = [];
  clinicListOptions = [];
  clinicData = [];
  authorizedClinicList = [];

  loading = false;

  returnUrl = 'pages/patient/list';
  clinicUrl = 'pages/clinic/select';

  bsModalRef: BsModalRef;
  hasShownPopUp = false;

  loginFormGroup: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService,
    private storeService: StoreService,
    private modalService: BsModalService,
    private jwtHelper: JwtHelperService,
    private fb: FormBuilder
  ) {
    this.loginFormGroup = this.createLoginFormGroup();
    console.log('login');
  }

  ngOnInit() {
    this.authorizedClinicList = [];

    const localStorageClinicCode = localStorage.getItem('clinicCode');
    const localStorageClinicId = localStorage.getItem('clinicId');

    if (this.authService.isAuthenticated() && localStorageClinicCode && localStorageClinicId) {
      console.log('Authenticated');
      this.router.navigate([this.returnUrl]);
    } else if (this.authService.isAuthenticated() && !localStorageClinicCode && !localStorageClinicId) {
      this.storeService.preInit();
      this.storeService.getIsClinicLoaded().subscribe(data => {
        console.log('111 b)');
        this.getClinicForModal(data);
      });
    } else {
      console.log('111 c)');
      console.log('not authenticated ');
    }
  }

  ngOnDestroy() {
    console.log('111 DESTROYED)');
    this.storeService.resetClinicLoaded();
  }

  onLoginSubmit() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('clinicId');
    localStorage.removeItem('clinicCode');
    this.storeService.resetClinicLoaded();
    this.storeService.getIsClinicLoaded().subscribe(data => {
      console.log('CLINIC IS LOADED: ', data);
      this.getClinicForModal(data);
    });

    this.username = this.loginFormGroup.get('username').value;
    this.password = this.loginFormGroup.get('password').value;
    const user = new UserLogin(this.username, this.password);

    this.loading = true;
    this.authService.login(user).subscribe(
      resp => {
        // localStorage.setItem('access_token', resp.headers.get('Authorization').substring(7));
        localStorage.setItem('access_token', resp.body['access_token']);

        this.storeService.preInit();
        this.storeService.startNotificationPolling();
      },
      err => {
        this.alertService.error(err.error.message);
        this.loading = false;
      }
    );
  }

  createLoginFormGroup(): FormGroup {
    return this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  private getClinicForModal(data) {
    console.log('111 d)');
    this.storeService.getAuthorizedClinicList();
    this.authorizedClinicList = data;
    console.log('getClinicForModal: ', this.authorizedClinicList);

    const numClinics = this.authorizedClinicList.length;
    if (numClinics === 1) {

      console.log('1 CLINIC: ', this.authorizedClinicList);
      this.storeService.clinicCode = this.authorizedClinicList[0].clinicCode;
      this.storeService.clinicId = this.authorizedClinicList[0].id;

      localStorage.setItem('clinicId', this.storeService.clinicId);
      localStorage.setItem('clinicCode', this.storeService.clinicCode);

      this.storeService.listDoctorsByClinic();

      this.router.navigate(['pages/patient/list']);
    } else if (numClinics > 1) {
      console.log('111 e)');
      this.popClinicSelection();
    }

    console.log('LIST OF AUTHORIZED CLINICS: ', this.storeService.authorizedClinicList);
  }

  getClinicList() {
    if (this.clinicList.length < 1) {
      this.clinicList = this.storeService.getClinicList();
    } else {
      console.log('clinic list: ', this.clinicList);
    }
  }

  popClinicSelection() {
    const initialState = {
      title: 'Select Clinic'
    };

    // if (this.authService.isAuthenticated()) {
    if (
      this.authService.isAuthenticated() &&
      !localStorage.getItem('clinicCode') &&
      !localStorage.getItem('clinicId')
    ) {
      console.log('111 f)');
      // if (!this.hasShownPopUp) {
      this.bsModalRef = this.modalService.show(ClinicSelectComponent, {
        initialState,
        class: 'modal-x-lg',
        backdrop: 'static',
        keyboard: false
      });

      this.bsModalRef.content.event.subscribe(
        data => {
          console.log('111 g)');
          console.log('MODAL DATA RECEIVED: ', data);
          this.bsModalRef.hide();
          this.bsModalRef.content.event.unsubscribe();
        },
        err => {
          this.alertService.error(err.error.message);
          this.loading = false;
        }
      );

      //   this.hasShownPopUp = true;
      // } else {
      //   console.log('111 h)');
      //   console.log("don't pop up");
      //   this.storeService.resetClinicLoaded();
      // }
    } else {
      console.log('111 i)');
      console.log('Not authenticated.');
    }
  }
}
