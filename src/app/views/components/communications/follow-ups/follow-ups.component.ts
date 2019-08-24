import { DB_FULL_DATE_FORMAT, DISPLAY_DATE_FORMAT } from './../../../../constants/app.constants';
import { ApiPatientVisitService } from './../../../../services/api-patient-visit.service';
import { ApiCmsManagementService } from './../../../../services/api-cms-management.service';
import { Component, OnInit } from '@angular/core';
import { AlertService } from './../../../../services/alert.service';
import { StoreService } from './../../../../services/store.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-follow-ups',
  templateUrl: './follow-ups.component.html',
  styleUrls: ['./follow-ups.component.scss']
})
export class FollowUpsComponent implements OnInit {
  rows = [];
  columns = [
    { name: 'Date', prop: 'date', flexGrow: 1 }, // Let display name be #
    { name: 'Name', prop: 'name', flexGrow: 2 },
    { name: 'Doctor', prop: 'doctor', flexGrow: 2 },
    { name: 'Purpose', prop: 'purpose', flexGrow: 2 },
    { name: 'Phone #', prop: 'phone', flexGrow: 2 },
    { name: 'PatientID', prop: 'patientid', flexGrow: 0 }
    // { name: 'Action', flexGrow: 2 }
  ];

  constructor(
    private router: Router,
    private alertService: AlertService,
    private store: StoreService,
    private apiCmsManagementService: ApiCmsManagementService,
    private apiPatientVisitService: ApiPatientVisitService
  ) {}

  ngOnInit() {
    const clinicId = this.store.getClinicId();
    this.getFollowUps(clinicId);
    this.getDoctorName('test');
  }

  getDoctorName(id: string) {
    const doctorList = this.store.getDoctorList();
    // console.log('doctorList: ', doctorList);

    const doct = doctorList.find(function(x) {
      if (x.id === id) {
        return x;
      }
    });
    return doct !== undefined ? doct.name : 'Doctor name not found';
  }

  getFollowUps(clinicId) {
    this.apiPatientVisitService
      .listFollowUps(
        clinicId,
        moment().format(DISPLAY_DATE_FORMAT),
        moment()
          .add(5, 'days')
          .format(DISPLAY_DATE_FORMAT)
      )
      .subscribe(
        resp => {
          console.log('resp: ', resp);
          let tempRows = [];

          if (resp) {
            const { payload } = resp;
            tempRows = payload.map((d, index) => {
              let doctorName = '';
              if (d.followups !== undefined && d.patient !== undefined) {
                if (d.followups.doctorId !== undefined) {
                  doctorName = this.getDoctorName(d.followups.doctorId);
                } else {
                  doctorName = 'Doctor';
                }

                const tempPatient = {
                  patientid: d.patient.id,
                  date: d.followups.followupDate,
                  name: d.patient.name,
                  doctor: doctorName, //to be changed to doctor
                  purpose: d.followups.remarks,
                  phone: d.patient.contactNumber.number
                };
                return tempPatient;
              }
            });

            let tempRows2 = [];
            tempRows.forEach(row => {
              if (row !== undefined) tempRows2.push(row);
            });

            this.rows = tempRows2;
            console.log(this.rows);
          }
        },
        err => {
          alert(err);
        }
      );
  }

  redirectToPatientDetail(patientId: string, name: string) {
    //this.apiCmsManagementService.setPatientId(patientId);
    this.store.setPatientId(patientId);
    this.router.navigate(['/pages/patient/detail']);
    return false;
  }
}
