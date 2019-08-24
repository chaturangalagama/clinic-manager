import { Component, OnInit, Input } from '@angular/core';

import { DISPLAY_DATE_FORMAT } from '../../../constants/app.constants';

import { StoreService } from '../../../services/store.service';
import { AlertService } from '../../../services/alert.service';
import { ApiCmsManagementService } from '../../../services/api-cms-management.service';
import { NgxPermissionsService } from 'ngx-permissions';

import * as moment from 'moment';

@Component({
  selector: 'app-patient-detail-vaccination',
  templateUrl: './patient-detail-vaccination.component.html',
  styleUrls: ['./patient-detail-vaccination.component.scss']
})
export class PatientDetailVaccinationComponent implements OnInit {
  @Input() patientInfo;
  @Input() historyInfo;

  vaccineInfo = [];

  constructor(
    private store: StoreService,
    private alertService: AlertService,
    private apiCmsManagementService: ApiCmsManagementService,
    private permissionsService: NgxPermissionsService
  ) {}

  ngOnInit() {
    console.log("vaccine history: ",this.vaccineInfo);

    // this.vaccineInfo = this.store.getVacinnationList();
  }
  
  convertUnixDateToDashFormat(date) {
    return moment(moment(date).format('L') || '-').format('DD-MM-YYYY');
  }

  disableVaccinePrint() {
    if (this.vaccineInfo.length != 0) {
      return false;
    } else {
      return true;
    }
  }

  getDoseName(doseId) {
    let doseName = '';
    this.vaccineInfo.forEach(vaccine => {
      const doseFound = vaccine.doses.map(dose => {
        if (dose.doseId === doseId) {
          doseName = dose.name;
        }
      });
    });
    return doseName;
  }

  selectedCert($event) {
    console.log('selected cert: ', $event);
  }

  getVaccineName(doseId, vaccineInfo) {
    let vaccineName = '';

    if (this.vaccineInfo) {
      this.vaccineInfo.forEach(vaccine => {
        vaccine.doses.forEach(dose => {
          if (dose.doseId === doseId) {
            vaccineName = vaccine.name;
          }
        });
      });
    }
    return vaccineName;
  }

  onBtnPrintVCClicked() {
    if (this.patientInfo) {
      console.log('patientInfo: ', this.patientInfo);
    }

    if (this.historyInfo) {
      console.log('History Info: ', this.historyInfo);
    }

    if (this.vaccineInfo) {
      console.log('Vaccine Info: ', this.vaccineInfo);
    } else {
      console.log('vaccine Info: ', this.vaccineInfo);
      // vaccineInfo = this.apiCmsManagementService.listVaccinations();
    }

    const vaccinationSelected = this.patientInfo.patientVaccinations.filter(v => v.isSelected === true);

    if (vaccinationSelected.length > 0) {
      this.apiCmsManagementService.searchLabel('VACCINATION_CERTIFICATE').subscribe(
        res => {
          console.log('historyInfo: ', this.historyInfo[0]);
          const clinic = this.store.getClinicList().find(clinic => clinic.id === this.store.getClinicId());

          const patient = this.patientInfo;

          // if (this.historyInfo[0].consulation) {
          const consultDoctor = this.store
            .getDoctorList()
            .find(doctor => doctor.id === this.historyInfo[0].consultation.doctorId);
          const consultDoctorName = consultDoctor.mcr
            ? consultDoctor.name + ' (' + consultDoctor.mcr + ')'
            : consultDoctor.name;

          const currentDoctor = this.store
            .getDoctorList()
            .find(doctor => doctor.id === this.historyInfo[0].consultation.doctorId);
          // }
          const currentUser = this.store.getUser();
          let currentUserName;
          if (
            this.permissionsService.getPermission('ROLE_DOCTOR') &&
            !this.permissionsService.getPermission('ROLE_CA')
          ) {
            // Doctor Role
            currentUserName = consultDoctor.name;
          } else {
            // CA / Other Rolew
            currentUserName = currentUser.firstName + ' ' + currentUser.lastName;
          }

          const w = window.open();
          w.document.open();
          let html = '';
          vaccinationSelected.forEach(v => {
            const template = JSON.parse(res.payload.template);
            // let template = vaccinationCertificateTemplate;

            const immunization = `<div class="row">
                        <div class="col-4">
                            ${this.getVaccineName(v.vaccineId, this.vaccineInfo)}
                        </div>
                        <div class="col-4">
                            ${v.vaccineId} 
                        </div>
                        <div class="col-4">
                            ${this.convertUnixDateToDashFormat(v.givenDate)}
                        </div>
                    </div>`;

            html = template
              .replace(
                '{{clinicAddress}}',
                `${clinic.address.address.toUpperCase() || ''}, SINGAPORE ${clinic.address.postalCode}`
              )
              .replace('{{clinicTel}}', clinic.contactNumber)
              .replace('{{clinicFax}}', clinic.faxNumber)
              .replace('{{patientName}}', patient.name)
              .replace('{{patientUserIdType}}', patient.userId.idType)
              .replace('{{patientUserId}}', patient.userId.number)
              .replace('{{patientGender}}', patient.gender)
              .replace('{{patientDOB}}', patient.dob)
              .replace('{{doctorName}}', consultDoctorName) //consultDoctor.name
              .replace('{{doctorOccupation}}', consultDoctor.speciality) //consultDoctor.speciality
              .replace('{{currentUserName}}', currentUserName)
              //      .replace('{{assistantName}}', `Dr. ${currentDoctor.name}`)
              .replace('{{printDate}}', moment().format(DISPLAY_DATE_FORMAT));
            html = html.replace('{{immunizations}}', immunization);
            w.document.write(html);
          });

          w.document.close();
          console.log('document closed');
          w.onload = () => {
            console.log('window loaded');
            w.window.print();
          };
          w.onafterprint = () => {
            w.close();
          };
        },
        err => this.alertService.error(JSON.stringify(err.error['message']))
      );
    }
  }
}
