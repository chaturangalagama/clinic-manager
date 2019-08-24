import { FormArray } from '@angular/forms';
import { MedicalCoverageResponse } from './../../objects/response/MedicalCoverageResponse';
import { AlertService } from './../../services/alert.service';
import { UtilsService } from './../../services/utils.service';
import { AuthService } from './../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { Component } from '@angular/core';
import * as moment from 'moment';
import { timer } from 'rxjs';
import { StoreService } from '../../services/store.service';
import { ApiPatientInfoService } from '../../services/api-patient-info.service';
import { DB_FULL_DATE_FORMAT } from '../../constants/app.constants';
import { HEADER_TITLES } from './../../constants/app.constants';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html'
})
export class AppHeaderComponent {
  showRegistryMenu = false;
  showPatientDetails = false;
  headerTitle = '';
  notifications = [];
  doctor;
  clinic;
  username;
  doctorGroup;
  speciality;
  patientInfo;
  coverages: MedicalCoverageResponse;
  medicalCoverageFormArray: FormArray;

  constructor(
    private router: Router,
    public store: StoreService,
    private apiPatientInfoService: ApiPatientInfoService,
    private auth: AuthService,
    private utilsService: UtilsService,
    private permissionsService: NgxPermissionsService,
    private alertService: AlertService
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('current url', event.url); // event.url has current url
        // this.headerTitle = HEADER_TITLES.find(function(x) {
        //   return x.url === event.url;
        // }).value;

        HEADER_TITLES.map(title => {
          if (title.url === event.url) {
            this.headerTitle = title.value;
          }
        });
        console.log('this.headerTitle: ', this.headerTitle);
        // your code will goes here
        if (event.url.toLowerCase().includes('consultation/add')) {
          this.showRegistryMenu = true;
        } else if (event.url.toLowerCase().includes('patient/management')) {
          // this.getPatientInfo();
          this.showPatientDetails = true;
        } else {
          this.showRegistryMenu = false;
          this.showPatientDetails = false;
        }
      }
    });
  }

  onBtnNotification() {
    this.notifications = this.store
      .getNotificationList()
      .sort((a, b) => (a.read === b.read ? 0 : a.read ? -1 : 1))
      .sort(
        (a, b) =>
          moment(b.createdDateTime, DB_FULL_DATE_FORMAT).isAfter(moment(a.createdDateTime, DB_FULL_DATE_FORMAT))
            ? 1
            : -1
      )
      .map(notification => {
        return {
          read: notification.read,
          message: notification.message,
          fromNow: moment(notification.createdDateTime, DB_FULL_DATE_FORMAT).fromNow()
        };
      });
  }

  getPatientInfo(){
    const source = timer(200);

    const subscribe = source.subscribe(val => {
      if(this.store.getUserId())
      {
        this.apiPatientInfoService.searchBy('systemuserid', this.store.getPatientId()).subscribe(
          res => {
            const pInfo = res.payload;
            this.apiPatientInfoService.searchAssignedPoliciesByUserId(pInfo['userId']).subscribe(
              resp => {
                if (resp.payload) {
                  this.coverages = new MedicalCoverageResponse(
                    resp.payload.INSURANCE,
                    resp.payload.CORPORATE,
                    resp.payload.CHAS,
                    resp.payload.MEDISAVE
                  );
                  // this.populateData(this.coverages);
                  // this.medicalCoverageFormArray.updateValueAndValidity();
                  // this.updateFormGroup();
                }
              },
              err => this.alertService.error(JSON.stringify(err))
            );

            console.log("pInfo: ",pInfo);

            this.updatePatientInfo(pInfo);
          },
          err => {
            this.alertService.error(JSON.stringify(err));
            this.store.setPatientId('');
            this.router.navigate(['pages/patient/detail']);
          }
        );
      }
    });
  }

  pick(obj: Object, keys): Object {
    return Object.keys(obj)
      .filter(key => keys.includes(key))
      .reduce((pickedObj, key) => {
        pickedObj[key] = obj[key];
        return pickedObj;
      }, {});
  }

  updatePatientInfo(arr){
    console.log("UPDATING USER",  arr);
    const keys = [
      'userId',
      'name',
      'Sex',
      'dob',
      'maritalStatus',
      'contactNumber',
      'address'
      // 'Address',
      // 'Medical Coverage',
    ];
    this.patientInfo = this.pick(arr, keys);
    console.log("UPDATE USER",  this.patientInfo);
  }

  onBtnProfile() {
    const user = this.store.getUser();
    this.clinic = this.store.getClinicList().find(clinic => clinic.id === this.store.getClinicId());
    this.doctor = this.store.getDoctorList().find(doctor => doctor.id === this.store.getUserId());

    if (this.permissionsService.getPermission('ROLE_CA') && !this.permissionsService.getPermission('ROLE_DOCTOR')) {
      // CA Role
      this.username = user.firstName + ' ' + user.lastName;
      this.doctorGroup = 'CA';
      this.speciality = 'General practitioner ';
    } else if (
      this.permissionsService.getPermission('ROLE_DOCTOR') &&
      !this.permissionsService.getPermission('ROLE_CA')
    ) {
      // Doctor Role
      this.username = this.doctor.name;
      this.doctorGroup = this.doctor.doctorGroup;
      this.speciality = this.doctor.speciality;
    } else {
      // Admin / Other Role
      this.username = user.firstName + ' ' + user.lastName;
      this.doctorGroup = 'Admin';
      this.speciality = 'Administration Office';
    }
  }

  onBtnLogout() {
    // this.store.unsubscribeNotificationPolling();
    // localStorage.removeItem('access_token');
    // localStorage.removeItem('clinicId');
    // localStorage.removeItem('clinicCode');

    // this.store.clinicCode = '';
    // this.store.clinicId = '';
    // this.router.navigate(['login']);
    this.auth.logout();
  }

  onBtnChangePassword() {
    this.router.navigate(['/pages/profile']);
  }

  markAllAsRead() {
    this.store.getNotificationList().forEach(notification => {
      if (!notification.read) {
        this.apiPatientInfoService
          .markNotificationAsRead(notification.id)
          .subscribe(res => {}, err => console.log(JSON.stringify(err)));
      }
      notification.read = true;
    });
    this.store.updateUnreadNotificationList();
    this.onBtnNotification();
  }

  formatToTitleCase(string) {
    return this.utilsService.convertToTitleCaseUsingSpace(string);
  }
}
