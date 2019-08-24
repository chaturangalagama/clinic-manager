import { Clinic } from './../../../../objects/response/Clinic';

import { Router } from '@angular/router';
import { navigation } from './../../../../_nav';
import { StoreService } from './../../../../services/store.service';
import { Component, OnInit, EventEmitter } from '@angular/core';

import { timer } from 'rxjs';

@Component({
  selector: 'app-clinic-select',
  templateUrl: './clinic-select.component.html',
  styleUrls: ['./clinic-select.component.scss']
})
export class ClinicSelectComponent implements OnInit {
  public event: EventEmitter<any> = new EventEmitter();
  clinicList = Array<Clinic>();
  authorizedClinicList = Array<Clinic>();
  userName = '';
  testLength = 12;
  maxWidthPerLine = 24;

  constructor(private storeService: StoreService, private router: Router) { }

  ngOnInit() {
    this.getClinicList();
    this.getListOfAuthorizedClinics();
    console.log('111 j)');
  }

  getClinicList() {
    if (this.clinicList.length < 1) {
      console.log('111 k)');
      this.clinicList = this.storeService.getClinicList();
    } else {
      console.log('111 l)');
      console.log('clinic list: ', this.clinicList);
    }
  }

  getListOfAuthorizedClinics() {
    console.log('111 m)');
    const userName = this.storeService.getUser().userName;
    this.authorizedClinicList = this.storeService.authorizedClinicList;
  }

  onClick() {
    console.log('CLICKED!');
  }

  onSelect(clinic: Clinic) {
    console.log('clinicCode: ', clinic);

    this.storeService.clinicCode = clinic.clinicCode;
    this.storeService.clinicId = clinic.id;
    this.storeService.clinic = this.storeService.getClinic();

    localStorage.setItem('clinicCode', this.storeService.clinicCode);
    localStorage.setItem('clinicId', clinic.id);

    this.storeService.listDoctorsByClinic();

    const clinicSelected = this.storeService.getClinicList().find(function (_clinic) {
      return _clinic.clinicCode === clinic.clinicCode;
    });

    if (clinicSelected) {
      clinicSelected.clinicStaffUsernames.forEach(username => {
        if (username === this.storeService.getUser().userName) {
          this.event.emit('USER ACCESSED');
          this.router.navigate(['pages/patient/list']);
        } else {
          console.log('USERNAME: ', this.storeService.getUser().userName);
        }
      });
    } else {
      console.log('no selected clinic');
    }
  }

  formatAddressMultiLine(clinic: string, rowNumber: number) {
    let splitAt: number;

    if (clinic && clinic.length > this.maxWidthPerLine) {
      splitAt = clinic.substring(this.maxWidthPerLine, clinic.length).search(' ');
      return rowNumber === 0
        ? clinic.substring(0, this.maxWidthPerLine + splitAt)
        : clinic.substring(this.maxWidthPerLine + splitAt + 1, clinic.length);
    } else {
      return clinic;
    }
  }

  checkPostalCodeExistsInAddressParam(address: string) {
    if (address.search('SINGAPORE') !== 0) {
      return true;
    } else {
      return false;
    }
  }
}
