import { NgxPermissionsService } from 'ngx-permissions';
import { AppConfigService } from './../../../services/app-config.service';
import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FileUploader } from 'ng2-file-upload';
import { saveAs } from 'file-saver';
import { Doctor } from './../../../objects/SpecialityByClinic';
import { Clinic } from './../../../objects/response/Clinic';

import { DISPLAY_DATE_FORMAT, DB_FULL_DATE_FORMAT, MC_HALFDAY_OPTIONS } from '../../../constants/app.constants';

import { PatientHistoryDetailAddDocumentComponent } from './patient-history-detail-add-document/patient-history-detail-add-document.component';
import { PatientHistoryDetailEditNoteComponent } from './patient-history-detail-edit-note/patient-history-detail-edit-note.component';
import { PatientHistoryDetailEditCertificateComponent } from './patient-history-detail-edit-certificate/patient-history-detail-edit-certificate.component';

import { UtilsService } from './../../../services/utils.service';
import { StoreService } from '../../../services/store.service';
import { AlertService } from '../../../services/alert.service';
import { ApiPatientVisitService } from '../../../services/api-patient-visit.service';
import { ApiCmsManagementService } from '../../../services/api-cms-management.service';
import { PrintTemplateService } from './../../../services/print-template.service';

import * as moment from 'moment';

@Component({
  selector: 'app-patient-history-detail',
  templateUrl: './patient-history-detail.component.html',
  styleUrls: ['./patient-history-detail.component.scss']
})
export class PatientHistoryDetailComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() hotKeySaveOnHistoryDetailTab: boolean;
  @Output() reloadHistoryList: EventEmitter<void> = new EventEmitter<void>();
  bsModalRef: BsModalRef;

  uploader: FileUploader;
  hasDropZoneOver = false;

  paymentInfo;

  isCertificateChanged = false;

  constructor(
    private modalService: BsModalService,
    private store: StoreService,
    private alertService: AlertService,
    private utilService: UtilsService,
    private apiCmsManagementService: ApiCmsManagementService,
    private apiPatientVisitService: ApiPatientVisitService,
    private appConfig: AppConfigService,
    private permissionsService: NgxPermissionsService,
    private printTemplateService: PrintTemplateService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    console.log('formGroup: ', this.formGroup);
    this.uploader = new FileUploader({
      url: `${
        this.appConfig.getConfig().API_DOCUMENT_URL
      }/upload/visit/${this.store.getPatientVisitRegistryId()}/OTHER`,
      disableMultipart: true,
      formatDataFunction: item => {
        const index = this.uploader.getIndexOfItem(item);
        const values = this.formGroup.get('newDocumentsArray').value;
        const sendable = new FormData();
        sendable.append('clinicId', this.store.getClinicId());
        sendable.append('name', values[index].name);
        sendable.append('fileName', item.file.name);
        sendable.append('description', values[index].description);
        sendable.append(item.alias, item._file, item.file.name);

        item.description = values[index].description; // Remember description for next upload dialog input

        return sendable;
      },
      authToken: `Bearer ${localStorage.getItem('access_token')}`
    });

    this.uploader.onBeforeUploadItem = item => {
      item.withCredentials = false;
    };

    this.uploader.onAfterAddingFile = item => {
      if (!item.file.type) item.file.type = 'application/octet-stream';
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      const payload = JSON.parse(response).payload;
      if (payload) {
        const index = this.uploader.getIndexOfItem(item);
        // When upload success, put the item into 'documentsArray',
        // remove item in 'newDocumentsArray' and remove item in `uploadQueue`
        const newDocumentsArray = this.formGroup.get('newDocumentsArray') as FormArray;
        const documentsArray = this.formGroup.get('documentsArray') as FormArray;

        const uploadedDocument = this.fb.group({
          names: { value: newDocumentsArray.value[index].names },
          name: newDocumentsArray.value[index].name,
          document: item.file.name,
          description: newDocumentsArray.value[index].description,
          type: item.file.type,
          size: item.file.size,
          fileId: payload.fileId,
          clinicId: payload.clinicId
        });
        documentsArray.push(uploadedDocument);
        newDocumentsArray.removeAt(index);
        this.uploader.removeFromQueue(item);
      } else {
        item.errorMsg = JSON.parse(response).message || '';
      }
    };

    const memo = this.formGroup.get('memo').value.replace(/<p>&nbsp;<\/p>/g, '');
    this.formGroup.get('memo').patchValue(memo);
  }

  isDoctor() {
    return this.permissionsService.getPermission('ROLE_DOCTOR');
  }

  fileOver(event) {
    this.hasDropZoneOver = event;
  }

  openModal(event) {
    this.fileUploadModal();
  }

  fileUploadModal() {
    const initialState = {
      title: 'Uploaded Documents',
      uploader: this.uploader,
      formGroup: this.formGroup
    };

    this.modalService.show(PatientHistoryDetailAddDocumentComponent, {
      initialState,
      class: 'modal-lg'
    });
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log('event: ', event);

    if (this.hotKeySaveOnHistoryDetailTab) {
      switch (event.keyCode) {
        case 115:
          console.log('F4 Calling Patient History Detail Save');
          this.onBtnSaveClicked();
          break;
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
        case 121:
          console.log('F10');
          break;
      }
    }
  }

  onBtnPreviousClicked() {
    const patientDetailFormGroup = this.formGroup.parent as FormGroup;
    patientDetailFormGroup.patchValue({
      isHistoryList: true,
      historyDetailIndex: -1
    });
    this.uploader.clearQueue();
    const newDocumentsArray = this.formGroup.get('newDocumentsArray') as FormArray;
    while (newDocumentsArray.length) {
      newDocumentsArray.removeAt(0);
    }
  }

  onBtnEditNotesClicked() {
    const initialState = {
      title: 'CONSULTATION NOTES',
      consultationNotes: this.formGroup.get('notes')
    };

    this.modalService.show(PatientHistoryDetailEditNoteComponent, {
      initialState,
      class: 'modal-lg'
    });
  }

  onBtnEditMedicalCertificatesClicked() {
    const initialState = {
      title: 'MEDICAL CERTIFICATE',
      certificateArray: this.formGroup.get('certificateArray')
    };

    this.modalService.show(PatientHistoryDetailEditCertificateComponent, {
      initialState,
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    });
  }

  onBtnPrintClicked() {
    this.printTemplateService.updateAllLabelTemplates();
  }

  onBtnSaveClicked() {
    const consultationEntity = this.formGroup.get('consultationInfo').value;
    consultationEntity.consultationNotes = this.formGroup.value.notes;
    this.formatMedicalCertificateDate();
    const medicalCertificates = this.formGroup.value.certificateArray;

    delete consultationEntity['consultationStartTime'];
    delete consultationEntity['consultationEndTime'];
    delete consultationEntity['medicalCertificates'];

    const consultationInfo = {
      consultationEntity: consultationEntity,
      diagnosisIds: this.formGroup.get('diagnosisArray').value.map(obj => obj.id)
    };

    console.log('this.formGroup.value.certificateArray: ', this.formGroup.value.certificateArray);

    this.formGroup.value.certificateArray.map(certificate => {
      if (certificate.halfDayOption === '') {
        delete certificate.halfDayOption;
      }
    });

    console.log('Save: ', consultationInfo);
    console.log('Save MC: ', medicalCertificates);
    console.log('FORMGROUP: ', this.formGroup.value);
    this.apiPatientVisitService.consultationUpdate(this.store.getPatientVisitRegistryId(), consultationInfo).subscribe(
      res => {
        const { payload } = res;

        if (payload && res.statusCode && res.statusCode === 'S0000') {
          console.log('update visit detail success', payload);
          this.updateMedicalCertificate(medicalCertificates);
        } else {
          this.alertService.error(JSON.stringify(payload.message));
        }

        console.log(res);
        this.isCertificateChanged = false;
      },
      err => this.alertService.error(JSON.stringify(err))
    );
  }

  updateMedicalCertificate(medicalCertificates) {
    this.apiPatientVisitService
      .medicalCertificatesUpdate(this.store.getPatientVisitRegistryId(), medicalCertificates)
      .subscribe(
        res => {
          const { payload } = res;

          if (payload && res.statusCode && res.statusCode === 'S0000') {
            this.alertService.success('Successfully Updated.');
            this.reloadHistoryList.emit();
            console.log('update medical certificates success', payload);
          } else {
            this.alertService.error(JSON.stringify(payload.message));
          }

          console.log(res);
          this.isCertificateChanged = false;
        },
        err => this.alertService.error(JSON.stringify(err))
      );
  }

  formatMedicalCertificateDate() {
    const medicalCertificates = <FormArray>this.formGroup.get('certificateArray');
    console.log('medicalcerts retrieved: ', medicalCertificates);
    medicalCertificates.controls.map((item, index) => {
      const startDate = item.get('startDate').value;
      const newDate = moment(startDate, DISPLAY_DATE_FORMAT).format(DISPLAY_DATE_FORMAT);
      console.log('FORMAT DATE', startDate, newDate);
      (<FormArray>this.formGroup.get('certificateArray'))
        .at(index)
        .get('startDate')
        .patchValue(newDate);
      (<FormArray>this.formGroup.get('certificateArray'))
        .at(index)
        .get('startDate')
        .updateValueAndValidity();
    });
  }

  onDownloadDocument(index) {
    const files = this.formGroup.get('documentsArray').value;
    const file = files[index];
    this.apiPatientVisitService
      .downloadDocument( this.store.getPatientVisitRegistryId(), file.fileId)
      .subscribe(
        res => {
          saveAs(res, file.document);
        },
        err => this.alertService.error(JSON.stringify(err))
      );
  }

  onDownloadNewDocument(index) {
    const files = this.formGroup.get('newDocumentsArray').value;
    const file = files[index];
    console.log(file);
    this.apiPatientVisitService
      .downloadDocument(this.store.getPatientVisitRegistryId(), file.fileId)
      .subscribe(
        res => {
          saveAs(res, file.document);
        },
        err => this.alertService.error(JSON.stringify(err))
      );
  }

  onRemoveDocumemt(index) {
    const item = this.uploader.queue[index];
    item.remove();
    const newDocumentsArray = this.formGroup.get('newDocumentsArray') as FormArray;
    newDocumentsArray.removeAt(index);
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

        const patient = this.formGroup.get('patientInfo').value;
        const clinic = this.store.getClinicList().find(clinic => clinic.id === this.store.getClinicId());
        const drugs = this.formGroup.get('itemArray').value.filter(item => {
          const storeItem = this.store.chargeItemList
            .map(item => item.item)
            .find(storeItem => storeItem.code === item.itemCode);
          return storeItem && storeItem.itemType && storeItem.itemType === 'DRUG';
        });

        if (drugs.length) {
          const w = window.open();
          w.document.open();

          drugs.forEach(drug => {
            const storeItem = this.store.chargeItemList
              .map(item => item.item)
              .find(storeItem => storeItem.code === drug.itemCode);
            const drugCautionary = storeItem.indications ? this.appendFullStop(storeItem.indications) : '';
            const drugRemark = drug.remarks && drug.remarks !== '' ? this.appendFullStop(drug.remarks).toUpperCase() : '';
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

        const patient = this.formGroup.get('patientInfo').value;
        const clinic = this.store.getClinicList().find(clinic => clinic.id === this.store.getClinicId());
        const medicalCertificates = this.formGroup.get('certificateArray').value;
        // const diagnosis = this.formGroup.get('diagnosisArray').value;

        const consultation = this.formGroup.get('consultationInfo').value;
        const consultDoctor = this.store.getDoctorList().find(doctor => doctor.id === consultation.doctorId);
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
          currentUserName = currentUser.firstName + ' ' + currentUser.lastName;
        }

        const w = window.open();
        w.document.open();

        medicalCertificates.forEach(medicalCertificate => {
          console.log('medical cert: ', medicalCertificate);
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
            .replace('{{clinicTel}}', clinic.contactNumber)
            .replace('{{clinicFax}}', clinic.faxNumber)
            .replace('{{companyRegistrationNumber}}', companyRegistrationNumber)
            .replace('{{gstRegistrationNumber}}', gstRegistrationNumber)
            .replace('{{patientName}}', patient.name)
            .replace('{{visitDate}}', moment().format(DISPLAY_DATE_FORMAT))
            .replace('{{patientUserIdType}}', patient.userId.idType)
            .replace('{{patientUserId}}', patient.userId.number)
            .replace('{{purpose}}', medicalCertificate.purpose)
            .replace('{{numberOfDays}}', medicalCertificate.numberOfDays + mcOptionStr)
            .replace('{{startDate}}', medicalCertificate.startDate)
            .replace('{{endDate}}', medicalCertificate.endDate)
            .replace('{{remark}}', mcRemark)
            // .replace(
            //   '{{diagnosis}}',
            //   diagnosis && diagnosis.length ? diagnosis.map(d => `${d.description}`).join(', ') : ''
            // )
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

        const patient = this.formGroup.get('patientInfo').value;
        const clinic = this.store.getClinicList().find(clinic => clinic.id === this.store.getClinicId());
        const patientReferrals = this.formGroup.get('referralArray').value;

        const consultation = this.formGroup.get('consultationInfo').value;
        const consultDoctor = this.store.getDoctorList().find(doctor => doctor.id === consultation.doctorId);
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
          let doctorName = '';
          if (referral.clinicId && referral.doctorId && !referral.externalReferral) {
            referClinic = this.store.getClinicList().find(clinic => clinic.id === referral.clinicId);
            referDoctor = this.store.getDoctorList().find(doctor => doctor.id === referral.doctorId);
            doctorName = referDoctor.name;
          } else {
            referClinic.name = referClinic.name ? referClinic.name : '';
            referClinic.address.address = referral.externalReferralDetails.address;
            referClinic.address.postalCode = '';

            doctorName = referral.externalReferralDetails.doctorName;
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
            .replace('{{referDoctorName}}', this.utilService.convertToTitleCaseUsingSpace(doctorName))
            .replace('{{memo}}', referral.memo.replace(/<p>&nbsp;<\/p>/g, '') || '')
            .replace('{{doctorSpeciality}}', consultDoctor.speciality)
            .replace('{{doctorGroup}}', consultDoctor.doctorGroup)
            .replace('{{doctorName}}', consultDoctorName)
            .replace('{{assistantName}}', `${consultDoctor.name}`)
            .replace('{{printDate}}', moment().format(DISPLAY_DATE_FORMAT))
            .replace('{{currentUserName}}', currentUserName);
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

        const patient = this.formGroup.get('patientInfo').value;
        const clinic = this.store.getClinicList().find(clinic => clinic.id === this.store.getClinicId());

        const consultation = this.formGroup.get('consultationInfo').value;
        const consultDoctor = this.store.getDoctorList().find(doctor => doctor.id === consultation.doctorId);
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
        const memo = this.formGroup.value.memo.replace(/<p>&nbsp;<\/p>/g, '');
        // tempMemo = tempMemo.replace(/<p>&nbsp;<\/p>/g, "");
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
          .replace('{{doctorName}}', consultDoctorName)
          .replace('{{assistantName}}', `${currentUserName}`)
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

        const patient = this.formGroup.get('patientInfo').value;
        const consultation = this.formGroup.get('consultationInfo').value;
        const clinic = this.store.getClinicList().find(clinic => clinic.id === this.store.getClinicId());

        const consultDoctor = this.store.getDoctorList().find(doctor => doctor.id === consultation.doctorId);
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

        const from = this.formGroup.value.timeChitFrom;
        const to = this.formGroup.value.timeChitTo;
        const visitDate = this.formGroup.value.date;

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
          .replace('{{consultDate}}', visitDate)
          .replace('{{consultStartTime}}', moment(from, 'HH:mm').format('HHmm'))
          .replace('{{consultEndTime}}', moment(to, 'HH:mm').format('HHmm'))
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
    this.printTemplateService.onBtnPrintPatientLabelClicked(this.formGroup.get('patientInfo').value);
  }

  onBtnPrintVCClicked() {
    this.apiCmsManagementService.searchLabel('VACCINATION_CERTIFICATE').subscribe(
      res => {
        const template = JSON.parse(res.payload.template);
        // const template = vaccinationCertificateTemplate;
        const patient = this.formGroup.get('patientInfo').value;
        const clinic = this.store.getClinicList().find(clinic => clinic.id === this.store.getClinicId());
        const vaccinations = this.formGroup.get('itemArray').value.filter(item => item.itemType === 'VACCINATION');

        const consultation = this.formGroup.get('consultationInfo').value;
        const consultDoctor = this.store.getDoctorList().find(doctor => doctor.id === consultation.doctorId);
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
            .replace('{{doctorName}}', consultDoctorName)
            .replace('{{doctorOccupation}}', consultDoctor.speciality)
            .replace('{{currentUserName}}', `${currentUserName}`)
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
        this.printTemplate(html);
      },
      err => this.alertService.error(JSON.stringify(err.error['message']))
    );
  }

  formatStringWithSpace(string) {
    return this.utilService.convertToTitleCaseUsingSpace(string);
  }

  formatStringWithUnderscore(string) {
    return this.utilService.convertToTitleCase(string);
  }
}
