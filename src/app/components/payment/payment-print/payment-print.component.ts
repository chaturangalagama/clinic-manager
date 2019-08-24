import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { DrugItem } from './../../../objects/DrugItem';
import { PrintTemplateService } from './../../../services/print-template.service';
import { Doctor } from './../../../objects/SpecialityByClinic';
import { Clinic } from './../../../objects/response/Clinic';
import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { DISPLAY_DATE_FORMAT, DB_FULL_DATE_FORMAT, MC_HALFDAY_OPTIONS } from '../../../constants/app.constants';
import { StoreService } from '../../../services/store.service';
import { AlertService } from '../../../services/alert.service';
import { ApiCmsManagementService } from '../../../services/api-cms-management.service';
import { NgxPermissionsService } from 'ngx-permissions';

import * as moment from 'moment';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-payment-print',
  templateUrl: './payment-print.component.html',
  styleUrls: ['./payment-print.component.scss']
})
export class PaymentPrintComponent implements OnInit {
  @Input() chargeFormGroup: FormGroup;
  @Input() consultationFormGroup: FormGroup;
  @Input() patientInfo;
  @Input() consultationInfo;
  @Output() tabSelected = new EventEmitter<String>();
  printFormGroup: FormGroup;

  displayMC = false;
  displayReferral = false;
  displayMemo = false;

  constructor(
    private store: StoreService,
    private alertService: AlertService,
    private apiCmsManagementService: ApiCmsManagementService,
    private permissionsService: NgxPermissionsService,
    private printTemplateService: PrintTemplateService,
    private utilsService: UtilsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.printFormGroup = this.chargeFormGroup.get('printFormGroup') as FormGroup;
    console.log('consultationFormGroup: ', this.consultationFormGroup);

    this.displayMCSection();
    this.displayPatientReferrals();
    this.checkDisplayMemo();
  }

  printTemplate(template: string) {
    const w = window.open();
    w.document.open();
    w.document.write(template);
    w.document.close();
    console.log('document closed');
    w.onload = () => {
      console.log('window loaded');
      w.window.print();
    };
    w.onafterprint = () => {
      w.close();
    };
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // console.log('event: ', event);
    switch (event.keyCode) {
      case 118:
        console.log('F7');
        this.onBtnPrintLabelClicked();
        break;
      case 119:
        console.log('F8');
        this.onBtnPrintMCClicked();
        break;
      case 120:
        console.log('F9');
        this.onBtnPrintPatientLabelClicked();
        break;
    }
  }

  onBtnPrintSlipClicked() {
    console.log('Print Prescription Slip');
  }

  appendFullStop(str: string) {
    if (str.charAt(str.length - 1) !== '.') {
      return str + '.';
    } else {
      return str;
    }
  }

  onBtnPrintLabelClicked() {
    this.apiCmsManagementService.searchLabel('DRUG_LABEL').subscribe(
      res => {
        const template = JSON.parse(res.payload.template);

        const patient = this.patientInfo;
        const clinic = this.store.getClinicList().find(clinic => clinic.id === this.store.getClinicId());
        const drugs = this.consultationInfo.medicalReferenceEntity.dispatchItemEntities.filter(item => {
          const storeItem = this.store.chargeItemList
            .map(item => item.item)
            .find(storeItem => storeItem.id === item.itemId);
          return storeItem && storeItem.itemType && storeItem.itemType === 'DRUG';
        });

        if (drugs.length) {
          const w = window.open();
          w.document.open();
          drugs.forEach(drug => {
            const storeItem = this.store.chargeItemList
              .map(item => item.item)
              .find(storeItem => storeItem.id === drug.itemId);
            const drugCautionary = storeItem.indications ? this.appendFullStop(storeItem.indications) : '';
            const drugRemark =
              drug.remarks && drug.remarks !== '' ? this.appendFullStop(drug.remarks).toUpperCase() : '';
            const drugInstruction = drug.instruct ? this.appendFullStop(drug.instruct.toLowerCase()) : '';

            const html = template
              .replace(
                '{{clinicAddress}}',
                `${clinic.address.address.toUpperCase() || ''}, SINGAPORE ${clinic.address.postalCode}`
              )
              .replace('{{clinicTel}}', clinic.contactNumber)
              .replace('{{clinicFax}}', clinic.faxNumber)
              .replace('{{drugName}}', storeItem.name)
              .replace('{{drugQuantity}}', drug.quantity)
              .replace('{{drugBatchNo}}', drug.batchNo)
              .replace('{{drugExpiryDate}}', drug.expiryDate)
              .replace('{{drugDosage}}', drug.dosage)
              .replace('{{drugFreqPerDay}}', drug.freqPerDay)
              .replace('{{drugCautionary}}', drugCautionary)
              .replace('{{drugInstruction}}', drugInstruction)
              .replace('{{drugRemarks}}', drugRemark)
              .replace('{{patientId}}', patient.patientNumber || '-')
              .replace('{{patientName}}', patient.name.toUpperCase())
              .replace('{{visitDate}}', moment().format(DISPLAY_DATE_FORMAT));
            w.document.write(html);
          });

          w.document.close();
          w.onload = () => {
            w.window.print();
          };
          w.onafterprint = () => {
            w.close();
          };
        }
      },
      err => this.alertService.error(JSON.stringify(err.error['message']))
    );
  }

  onBtnPrintMCClicked() {
    this.apiCmsManagementService.searchLabel('MEDICAL_CERTIFICATE').subscribe(
      res => {
        const template = JSON.parse(res.payload.template);
        const consultation = this.consultationInfo;
        const patient = this.patientInfo;
        const clinic = this.store.getClinicList().find(clinic => clinic.id === this.store.getClinicId());
        const medicalCertificates = this.printFormGroup.get('medicalCertificateArray').value;
        const diagnosisArray = this.consultationFormGroup.get('diagnosisIds') as FormArray;

        const diagnosis = diagnosisArray.getRawValue();

        const consultDoctor = this.store
          .getDoctorList()
          .find(doctor => doctor.id === consultation.medicalReferenceEntity.consultation.doctorId);
        const consultDoctorName = consultDoctor.mcr
          ? consultDoctor.name + ' (' + consultDoctor.mcr + ')'
          : consultDoctor.name;
        const consultDoctorSpeciality = consultDoctor.speciality ? consultDoctor.speciality : '';

        const currentUser = this.store.getUser();
        let currentUserName;

        if (this.permissionsService.getPermission('ROLE_DOCTOR') && !this.permissionsService.getPermission('ROLE_CA')) {
          // Doctor Role
          currentUserName = consultDoctor.name;
        } else {
          // CA / Other Rolew
          currentUserName = currentUser.lastName
            ? currentUser.firstName + ' ' + currentUser.lastName
            : currentUser.firstName;
        }

        const w = window.open();
        w.document.open();
        medicalCertificates.forEach(medicalCertificate => {
          const mcOption = MC_HALFDAY_OPTIONS.find(option => option.value === medicalCertificate.halfDayOption);
          const mcOptionStr = mcOption ? ' (' + mcOption.label + ') ' : '';
          const mcRemark = medicalCertificate.remark ? medicalCertificate.remark : '';
          const companyRegistrationNumber = clinic.companyRegistrationNumber ? clinic.companyRegistrationNumber : '';
          const gstRegistrationNumber = clinic.gstRegistrationNumber ? clinic.gstRegistrationNumber : '';

          const html = template
            .replace(
              '{{clinicAddress}}',
              `${clinic.address.address.toUpperCase() || ''}, SINGAPORE ${clinic.address.postalCode}`
            )
            .replace('{{companyRegistrationNumber}}', companyRegistrationNumber)
            .replace('{{gstRegistrationNumber}}', gstRegistrationNumber)
            .replace('{{clinicTel}}', clinic.contactNumber)
            .replace('{{clinicFax}}', clinic.faxNumber)
            .replace('{{patientName}}', patient.name)
            .replace('{{visitDate}}', moment().format(DISPLAY_DATE_FORMAT))
            .replace('{{patientUserIdType}}', patient.userId.idType)
            .replace('{{patientUserId}}', patient.userId.number)
            .replace('{{purpose}}', medicalCertificate.purpose)
            .replace('{{numberOfDays}}', medicalCertificate.numberOfDays + mcOptionStr)
            .replace('{{startDate}}', medicalCertificate.startDate)
            .replace('{{endDate}}', medicalCertificate.endDate)
            .replace('{{remark}}', mcRemark)
            .replace(
              '{{diagnosis}}',
              diagnosis && diagnosis.length ? diagnosis.map(d => `${d.description}`).join(', ') : ''
            )
            .replace('{{doctorName}}', consultDoctorName)
            .replace('{{doctorOccupation}}', consultDoctorSpeciality)
            .replace('{{refNo}}', medicalCertificate.referenceNumber ? medicalCertificate.referenceNumber : '')
            .replace('{{currentUserName}}', currentUserName)
            .replace('{{printDate}}', moment().format(DISPLAY_DATE_FORMAT));
          w.document.write(html);
        });

        w.document.close();
        w.onload = () => {
          w.window.print();
        };
        w.onafterprint = () => {
          w.close();
        };
      },
      err => this.alertService.error(JSON.stringify(err.error['message']))
    );
  }

  onBtnPrintLetterClicked() {
    this.apiCmsManagementService.searchLabel('REFERRAL_LETTER').subscribe(
      res => {
        const template = JSON.parse(res.payload.template);

        const consultation = this.consultationInfo;
        const patient = this.patientInfo;
        const clinic = this.store.getClinicList().find(clinic => clinic.id === this.store.getClinicId());
        const patientReferrals = this.printFormGroup.get('referralArray').value;

        const consultDoctor = this.store
          .getDoctorList()
          .find(doctor => doctor.id === consultation.medicalReferenceEntity.consultation.doctorId);
        const consultDoctorName = consultDoctor.mcr
          ? consultDoctor.name + ' (' + consultDoctor.mcr + ')'
          : consultDoctor.name;
        const currentUser = this.store.getUser();
        let currentUserName;

        if (this.permissionsService.getPermission('ROLE_DOCTOR') && !this.permissionsService.getPermission('ROLE_CA')) {
          // Doctor Role
          currentUserName = consultDoctor.name;
        } else {
          // CA / Other Rolew
          currentUserName = currentUser.firstName + ' ' + currentUser.lastName;
        }
        patientReferrals.forEach(referral => {
          let referClinic = new Clinic();
          let referDoctor: Doctor;
          let referDoctorName = '';
          if (referral.clinicId && referral.doctorId) {
            referClinic = this.store.getClinicList().find(clinic => clinic.id === referral.clinicId);
            referDoctor = this.store.getDoctorList().find(doctor => doctor.id === referral.doctorId);
            referDoctorName = referDoctor.name;
          } else {
            referClinic.name = referClinic.name ? referClinic.name : '';
            referClinic.address.address = referral.externalReferralDetails.address;
            referClinic.address.postalCode = '';

            referDoctorName = referral.externalReferralDetails.doctorName;
          }

          const html = template
            .replace(
              '{{clinicAddress}}',
              `${clinic.address.address.toUpperCase() || ''}, SINGAPORE ${clinic.address.postalCode}`
            )
            .replace('{{clinicTel}}', clinic.contactNumber)
            .replace('{{clinicFax}}', clinic.faxNumber)
            .replace('{{patientName}}', patient.name)
            .replace('{{patientUserIdType}}', patient.userId.idType)
            .replace('{{patientUserId}}', patient.userId.number)
            .replace(
              '{{referralDate}}',
              moment(referral.appointmentDateTime, DB_FULL_DATE_FORMAT).format('DD MMMM YYYY')
            )
            .replace('{{referClinicName}}', referClinic.name)
            .replace(
              '{{referClinicAddress}}',
              `${referClinic.address.address || ''}, ${referClinic.address.postalCode}`
            )
            .replace('{{referDoctorName}}', this.utilsService.convertToTitleCaseUsingSpace(referDoctorName))
            .replace('{{memo}}', referral.memo.replace(/<p>&nbsp;<\/p>/g, '') || '')
            .replace('{{doctorSpeciality}}', consultDoctor.speciality)
            .replace('{{doctorGroup}}', consultDoctor.doctorGroup)
            .replace('{{doctorName}}', consultDoctorName)
            .replace('{{currentUserName}}', currentUserName)
            .replace('{{printDate}}', moment().format(DISPLAY_DATE_FORMAT));
          if (referral.str) {
            this.printTemplate(html);
          }
        });
      },
      err => this.alertService.error(JSON.stringify(err.error['message']))
    );
  }

  onBtnPrintMemoClicked() {
    this.apiCmsManagementService.searchLabel('MEMO').subscribe(
      res => {
        const template = JSON.parse(res.payload.template);

        const consultation = this.consultationInfo;
        const patient = this.patientInfo;
        const clinic = this.store.getClinicList().find(clinic => clinic.id === this.store.getClinicId());

        const consultDoctor = this.store
          .getDoctorList()
          .find(doctor => doctor.id === consultation.medicalReferenceEntity.consultation.doctorId);
        const consultDoctorName = consultDoctor.mcr
          ? consultDoctor.name + ' (' + consultDoctor.mcr + ')'
          : consultDoctor.name;

        const currentUser = this.store.getUser();
        let currentUserName;
        if (this.permissionsService.getPermission('ROLE_DOCTOR') && !this.permissionsService.getPermission('ROLE_CA')) {
          // Doctor Role
          currentUserName = consultDoctor.name;
        } else {
          // CA / Other Rolew
          currentUserName = currentUser.firstName + ' ' + currentUser.lastName;
        }

        const date = moment().format('DD MMMM YYYY');
        const memo = this.printFormGroup.value.memo.replace(/<p>&nbsp;<\/p>/g, '');
        const html = template
          .replace(
            '{{clinicAddress}}',
            `${clinic.address.address.toUpperCase() || ''}, SINGAPORE ${clinic.address.postalCode}`
          )
          .replace('{{clinicTel}}', clinic.contactNumber)
          .replace('{{clinicFax}}', clinic.faxNumber)
          .replace('{{patientName}}', patient.name)
          .replace('{{patientUserIdType}}', patient.userId.idType)
          .replace('{{patientUserId}}', patient.userId.number)
          .replace('{{date}}', date)
          .replace('{{memo}}', memo || '')
          .replace('{{doctorSpeciality}}', consultDoctor.speciality)
          .replace('{{doctorGroup}}', consultDoctor.doctorGroup)
          .replace('{{doctorName}}', consultDoctorName)
          .replace('{{assistantName}}', currentUserName)
          .replace('{{printDate}}', moment().format(DISPLAY_DATE_FORMAT));
        this.printTemplate(html);
      },
      err => this.alertService.error(JSON.stringify(err.error['message']))
    );
  }

  onBtnPrintTimeChitClicked() {
    this.apiCmsManagementService.searchLabel('TIME_CHIT').subscribe(
      res => {
        const template = JSON.parse(res.payload.template);

        const patient = this.patientInfo;
        const consultation = this.consultationInfo;
        const clinic = this.store.getClinicList().find(clinic => clinic.id === this.store.getClinicId());

        const consultDoctor = this.store.getDoctorList().find(doctor => doctor.id === consultation.medicalReferenceEntity.consultation.doctorId);
        const consultDoctorName = consultDoctor.mcr
          ? consultDoctor.name + ' (' + consultDoctor.mcr + ')'
          : consultDoctor.name;

        console.log('doctor: ', consultDoctor);
        const currentUser = this.store.getUser();
        let currentUserName;
        if (this.permissionsService.getPermission('ROLE_DOCTOR') && !this.permissionsService.getPermission('ROLE_CA')) {
          // Doctor Role
          currentUserName = consultDoctor.name;
        } else {
          // CA / Other Rolew
          currentUserName = currentUser.firstName + ' ' + currentUser.lastName;
        }

        const from = this.printFormGroup.value.timeChitFrom;
        const to = this.printFormGroup.value.timeChitTo;
        const html = template
          .replace(
            '{{clinicAddress}}',
            `${clinic.address.address.toUpperCase() || ''}, SINGAPORE ${clinic.address.postalCode}`
          )
          .replace('{{clinicTel}}', clinic.contactNumber)
          .replace('{{clinicFax}}', clinic.faxNumber)
          .replace('{{patientName}}', patient.name)
          .replace('{{patientUserIdType}}', patient.userId.idType)
          .replace('{{patientUserId}}', patient.userId.number)
          .replace('{{patientName}}', patient.name)
          .replace('{{patientUserId}}', patient.userId.number)
          .replace('{{consultDate}}', moment(from, DB_FULL_DATE_FORMAT).format(DISPLAY_DATE_FORMAT))
          .replace('{{consultStartTime}}', moment(from, DB_FULL_DATE_FORMAT).format('HHmm'))
          .replace('{{consultEndTime}}', moment(to, DB_FULL_DATE_FORMAT).format('HHmm'))
          .replace('{{doctorSpeciality}}', consultDoctor.speciality)
          .replace('{{doctorName}}', consultDoctorName)
          .replace('{{currentUserName}}', currentUserName)
          .replace(new RegExp('{{printDate}}', 'g'), moment().format(DISPLAY_DATE_FORMAT));
        this.printTemplate(html);
      },
      err => this.alertService.error(JSON.stringify(err.error['message']))
    );
  }

  onBtnPrintPatientLabelClicked() {
    this.printTemplateService.onBtnPrintPatientLabelClicked(this.patientInfo);
  }

  onBtnPrintVCClicked() {
    this.apiCmsManagementService.searchLabel('VACCINATION_CERTIFICATE').subscribe(
      res => {
        const template = JSON.parse(res.payload.template);
        // let template = vaccinationCertificateTemplate;
        const consultation = this.consultationInfo;
        const patient = this.patientInfo;
        const clinic = this.store.getClinicList().find(clinic => clinic.id === this.store.getClinicId());
        console.log('consultationInfo', this.consultationInfo);
        // const vaccinations = this.consultationInfo.immunisationGiven.immunisation;
        const vaccinations = this.consultationInfo.medicalReferenceEntity.dispatchItemEntities.filter(item => {
          const storeItem = this.store.chargeItemList
            .map(item => item.item)
            .find(storeItem => storeItem.id === item.itemId);
          return storeItem && storeItem.itemType && storeItem.itemType === 'VACCINATION';
        });
        const consultDoctor = this.store.getDoctorList().find(doctor => doctor.id === consultation.medicalReferenceEntity.consultation.doctorId);
        const currentUser = this.store.getUser();
        let currentUserName;
        if (this.permissionsService.getPermission('ROLE_DOCTOR') && !this.permissionsService.getPermission('ROLE_CA')) {
          // Doctor Role
          currentUserName = consultDoctor.name;
        } else {
          // CA / Other Rolew
          currentUserName = currentUser.firstName + ' ' + currentUser.lastName;
        }
        let html = '';
        vaccinations.forEach(vaccination => {
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
            .replace('{{doctorName}}', consultDoctor.name)
            .replace('{{doctorOccupation}}', consultDoctor.speciality)
            .replace('{{currentUserName}}', currentUserName)
            .replace('{{printDate}}', moment().format(DISPLAY_DATE_FORMAT));

          const immunizations = vaccinations
            .map(vaccination => {
              return {
                name: vaccination.vaccine,
                dose: vaccination.dosage,
                dateAdminstered: vaccination.immunisationDate
              };
            })
            .map(
              obj => `<div class="row">
                <div class="col-4">
                    ${obj.name}
                </div>
                <div class="col-4">
                    ${obj.dose}
                </div>
                <div class="col-4">
                    ${obj.dateAdminstered || '-'}
                </div>
              </div>`
            );

          html = html.replace('{{immunizations}}', immunizations.join('\n'));
        });
        console.log('PRINTING TEMPLATE:');
        this.printTemplate(html);
      },
      err => this.alertService.error(JSON.stringify(err.error['message']))
    );
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.code === '0x003D') {
      this.onBtnPrintLabelClicked();
    } else if (event.code === '0x0042') {
      this.onBtnPrintMCClicked();
    }
  }

  onBtnNextClicked() {
    this.tabSelected.emit('Payment');
  }

  initialiseSections() {
    if (this.consultationFormGroup.get('medicalCertificates')) {
      this.displayMC = false;
      this.consultationFormGroup.get('medicalCertificates').value.forEach(mc => {
        console.log('mc: ', mc);
        console.log('mc.purpose.length: ', mc.purpose.length);
        console.log('mc.purpose: ', mc.purpose);
        if (
          (mc.purpose !== '' || mc.purpose !== null || mc.purpose.length > 0) &&
          (mc.remark !== '' || mc.remark !== null || mc.remark.length > 0)
        ) {
          this.displayMC = true;
          console.log('toDisplay MC: ', this.displayMC);
        }
      });
    }
  }

  displayMCSection() {
    if (this.consultationFormGroup.get('medicalCertificates')) {
      this.consultationFormGroup
        .get('medicalCertificates')
        .valueChanges.pipe(
          distinctUntilChanged(),
          debounceTime(200)
        )
        .subscribe(res => {
          this.displayMC = false;
          res.forEach(mc => {
            console.log('mc: ', mc);
            console.log('mc.purpose.length: ', mc.purpose.length);
            console.log('mc.purpose: ', mc.purpose);

            console.log('mc.purpose isNotEmpty: ', mc.purpose !== '' ? true : false);

            if (
              mc.purpose !== '' &&
              mc.purpose !== null &&
              mc.purpose.length > 0 &&
              (mc.remark !== '' && mc.remark !== null && mc.remark.length > 0)
            ) {
              this.displayMC = true;
              console.log('toDisplay MC: ', this.displayMC);
            }
          });
          this.patchMCValueToPrintFormGroup(res);
        });
    }
  }

  displayPatientReferrals() {
    if (this.consultationFormGroup.get('patientReferral').get('patientReferrals')) {
      console.log('this.consultationFormGroup: ', this.consultationFormGroup);
      this.consultationFormGroup
        .get('patientReferral')
        .get('patientReferrals')
        .valueChanges.pipe(
          distinctUntilChanged(),
          debounceTime(100)
        )
        .subscribe(res => {
          this.displayReferral = false;
          res.forEach(referral => {
            // console.log("referral: ", referral)
            if (
              referral.practice !== '' &&
              referral.practice !== null &&
              referral.practice.length > 0 &&
              (referral.memo !== '' && referral.memo !== null && referral.memo.length > 0)
            ) {
              this.displayReferral = true;
              // console.log("toDisplay referral: ", this.displayReferral)
            }
          });

          this.patchReferralValueToPrintFormGroup(res);
        });
    }
  }

  checkDisplayMemo() {
    if (this.consultationFormGroup.get('consultation').get('memo')) {
      this.consultationFormGroup
        .get('consultation')
        .get('memo')
        .valueChanges.pipe(
          distinctUntilChanged(),
          debounceTime(100)
        )
        .subscribe(res => {
          this.displayMemo = res;
          this.patchMemoToPrintFormGroup(res);
        });
    }
  }

  patchMCValueToPrintFormGroup(mc) {
    const medicalCertificateArray = this.printFormGroup.get('medicalCertificateArray') as FormArray;
    mc.forEach(medicalCertificate => {
      const { purpose, startDate, numberOfDays, referenceNumber, halfDayOption, remark } = medicalCertificate;
      const adjustedEndDate = numberOfDays - 1 >= 0 ? numberOfDays - 1 : 0;
      console.log('ADJUSTED END DATE: ', adjustedEndDate);
      const endDate = moment(medicalCertificate.startDate, DISPLAY_DATE_FORMAT)
        .add(adjustedEndDate, 'days')
        .format(DISPLAY_DATE_FORMAT);
      medicalCertificateArray.push(
        this.fb.group({
          purpose,
          startDate,
          endDate,
          numberOfDays,
          referenceNumber,
          halfDayOption,
          medicalCertificateStr: `${purpose} for ${numberOfDays} day(s) from ${startDate} to ${endDate}`,
          remark
        })
      );
    });
  }

  patchReferralValueToPrintFormGroup(referral) {
    const printReferralArray = this.printFormGroup.get('referralArray') as FormArray;

    printReferralArray.controls.forEach(control => printReferralArray.removeAt(0));

    referral.forEach(element => {
      let clinic = new Clinic();
      let str = '';
      const doctor = this.store.getDoctorList().find(doctor => doctor.id === element.doctorId);
      clinic = this.store.getClinicList().find(clinic => clinic.id === element.clinicId);
      const appointmentDateTime = element.appointmentDateTime ? element.appointmentDateTime : '';
      const clinicId = element.clinicId ? element.clinicId : '';
      const doctorId = element.doctorId ? element.doctorId : '';
      const externalReferral = element.externalReferral ? element.externalReferral : false;
      let memo: string = element.memo ? String(element.memo) : '';
      memo = memo ? memo.replace(/<p>&nbsp;<\/p>/g, '') : '';
      memo = memo ? memo.replace(/↵/, '') : '';
      const practice = element.practice ? element.practice : '';
      const externalReferralDetails = element.externalReferralDetails
        ? Object.assign({}, element.externalReferralDetails)
        : { address: '', doctorName: '', phoneNumber: '' };

      const address = externalReferralDetails.address ? externalReferralDetails.address : '';
      const doctorName = externalReferralDetails.doctorName ? externalReferralDetails.doctorName : '';
      const phoneNumber = externalReferralDetails.phoneNumber ? externalReferralDetails.phoneNumber : '';
      const externalReferralDetailsFg = this.fb.group({
        address: address,
        doctorName: doctorName,
        phoneNumber: phoneNumber
      });
      if (!externalReferral) {
        str = memo
          ? `Referral letter to ${doctor.name} (${clinic.name}@${clinic.address.address || ''} Singapore ${
              clinic.address.postalCode
            })`
          : '';
        element.str = str;
      } else {
        str = memo
          ? `Referral letter to ${externalReferralDetails.doctorName} (${externalReferralDetails.address})`
          : '';
        element.str = str;
      }
      const referralObj = this.fb.group({
        appointmentDateTime: appointmentDateTime,
        clinicId: clinicId,
        doctorId: doctorId,
        externalReferral: externalReferral,
        memo: memo,
        practice: practice,
        externalReferralDetails: externalReferralDetailsFg,
        str
      });
      printReferralArray.push(referralObj);
    });
  }

  patchMemoToPrintFormGroup(memo: string) {
    if (memo) {
      this.printFormGroup.get('memo').patchValue(memo);
    }
  }
}
