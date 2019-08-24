import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from './../../../services/alert.service';
import * as moment from 'moment';
import { ApiPatientVisitService } from '../../../services/api-patient-visit.service';
import { DISPLAY_DATE_FORMAT, DB_FULL_DATE_FORMAT } from './../../../constants/app.constants';
import { StoreService } from './../../../services/store.service';
import { SelectItemOptions } from '../../../objects/SelectItemOptions';
import { Subject } from 'rxjs';
import { Diagnosis } from '../../../objects/response/Diagnosis';
import { distinctUntilChanged, debounceTime, switchMap, tap } from 'rxjs/operators';
import { ApiCmsManagementService } from './../../../services/api-cms-management.service';

@Component({
  selector: 'app-claim-chas',
  templateUrl: './claim-chas.component.html',
  styleUrls: ['./claim-chas.component.scss']
})
export class ClaimChasComponent implements OnInit {
  @ViewChild('myTable') table: any;
  columns: any[] = [];
  rows: any[] = [];
  statusList = ['ALL', 'SUBMITTED', 'PENDING', 'REJECTED_PERMANENT', 'REJECTED', 'APPEALED', 'APPROVED'];
  doctorList: any[] = [];
  showEdit = false;

  formGroup: FormGroup;
  searchFormGroup: FormGroup;

  codes: Array<SelectItemOptions<Diagnosis>> = [];
  codesTypeahead = new Subject<string>();
  diagnosisLoading = false;

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private store: StoreService,
    private apiPatientVisitService: ApiPatientVisitService,
    private apiCmsManagementService: ApiCmsManagementService
  ) {}

  ngOnInit() {
    this.doctorList = this.store.getDoctors();

    this.newFormGroup();
    this.newSearchFormGroup();

    this.onSearchClaimClicked();

    this.onFilterInputChanged();
  }

  newFormGroup() {
    this.formGroup = this.fb.group({
      claimId: [{ value: '', disabled: true }, Validators.required],
      date: { value: '', disabled: true },
      HEcode: { value: '', disabled: true },
      clinic: { value: '', disabled: true },
      patientName: { value: '', disabled: true },
      payerName: { value: '', disabled: false },
      patientNric: { value: '', disabled: true },
      payerNric: { value: '', disabled: false },
      doctor: { value: '', disabled: false },
      referNo: { value: '', disabled: true },
      diagnosisCode: { value: '', disabled: false },
      receiptNo: { value: '', disabled: true },
      conAmt: { value: '', disabled: true },
      drugAmt: { value: '', disabled: true },
      labAmt: { value: '', disabled: true },
      otherAmt: { value: '', disabled: true },
      totAmt: { value: '', disabled: true },
      claimAmt: { value: '', disabled: false },
      status: { value: '', disabled: true }
    });
  }

  newSearchFormGroup() {
    this.searchFormGroup = this.fb.group({
      startDate: [
        moment()
          .subtract(1, 'months')
          .format(DISPLAY_DATE_FORMAT),
        Validators.required
      ],
      endDate: [moment().format(DISPLAY_DATE_FORMAT), Validators.required],
      status: this.statusList[0]
    });
  }

  updateForm(row: any) {
    this.formGroup.patchValue({
      claimId: row.claimId,
      date: row.billDate,
      HEcode: row.HEcode,
      clinic: row.clinic,
      patientName: row.patientName,
      patientNric: row.patientNric,
      payerName: row.payerName,
      payerNric: row.payerNric,
      doctor: row.doctor,
      referNo: row.referNo,
      diagnosisCode: row.diagnosisCode,
      conAmt: row.conAmt,
      drugAmt: row.drugAmt,
      labAmt: row.labAmt,
      otherAmt: row.otherAmt,
      totAmt: row.totAmt,
      claimAmt: row.claimAmt,
      status: row.status,
      receiptNo: row.receiptNo
    });
  }

  resetFormGroup() {
    this.showEdit = false;
    this.formGroup.reset();
    this.newFormGroup();
  }

  onEditUserClicked(row) {
    console.log('onEditUserClicked');
    this.showEdit = true;
    this.updateForm(row);
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
  }

  onSearchClaimClicked() {
    console.log('onSearchClaimClicked');
    const startDateStr = moment(this.searchFormGroup.get('startDate').value, 'DD-MM-YYYY').format('DD-MM-YYYY');
    const endDateStr = moment(this.searchFormGroup.get('endDate').value, 'DD-MM-YYYY').format('DD-MM-YYYY');
    const status = this.searchFormGroup.get('status').value;
    const clinicId = this.store.getClinic().id;

    this.apiPatientVisitService.listClaimsByClinlicByDate(clinicId, 'CHAS', status, startDateStr, endDateStr).subscribe(
      res => {
        // Mock Data
        // const response = JSON.parse('{"statusCode":"S0000","timestamp":"03-10-2018 06:45:34","message":"Success","payload":[{"claim":{"claimId":"0000000001","submissionDateTime":[2018,10,3,18,45,34,842000000],"attendingDoctorId":"00000001","claimDoctorId":"5b55aab70550de0021096e9c","payersNric":"G00001","payersName":"G00002","diagnosisCodes":["S01","S02"],"consultationAmt":100,"medicationAmt":50,"medicalTestAmt":20,"otherAmt":10,"claimExpectedAmt":180,"remark":"Nothing is there to be commented","claimStatus":"APPROVED","claimResult":{"referenceNumber":"9000001","resultDateTime":[2018,10,3,18,45,34,847000000],"amount":150,"statusCode":"SUCCESS","remark":"Ofcos its success"},"appealRejections":[]},"patientId":"P00001","visitId":"V0001","billNumber":"00001","patientName":"Patient Name","userId":{"idType":"NRIC","number":"P00001"}},{"claim":{"claimId":"0000000002","submissionDateTime":[2018,6,15,18,45,34,842000000],"attendingDoctorId":"00000002","claimDoctorId":"00000002","payersNric":"G00014","payersName":"G00015","diagnosisCodes":["S01","S02","S19","S12"],"consultationAmt":100,"medicationAmt":50,"medicalTestAmt":20,"otherAmt":10,"claimExpectedAmt":180,"remark":"Nothing is there to be commented","claimStatus":"APPROVED","claimResult":{"referenceNumber":"9000001","resultDateTime":[2018,10,3,18,45,34,847000000],"amount":150,"statusCode":"SUCCESS","remark":"Ofcos its success"},"appealRejections":[]},"patientId":"P00001","visitId":"V0001","billNumber":"00001","patientName":"Patient Name","userId":{"idType":"NRIC","number":"P00001"}},{"claim":{"claimId":"0000000003","submissionDateTime":[2018,9,11,18,45,34,842000000],"attendingDoctorId":"00000003","claimDoctorId":"00000003","payersNric":"G00005","payersName":"G00007","diagnosisCodes":["S01","S02","S55"],"consultationAmt":100,"medicationAmt":50,"medicalTestAmt":20,"otherAmt":10,"claimExpectedAmt":180,"remark":"Nothing is there to be commented","claimStatus":"APPROVED","claimResult":{"referenceNumber":"9000001","resultDateTime":[2018,10,3,18,45,34,847000000],"amount":150,"statusCode":"SUCCESS","remark":"Ofcos its success"},"appealRejections":[]},"patientId":"P00001","visitId":"V0001","billNumber":"00001","patientName":"Patient Name","userId":{"idType":"NRIC","number":"P00001"}}]}');
        // console.log(response.payload);
        this.rows = this.mapPayloadToRows(res.payload);
      },
      err => {
        this.alertService.error(JSON.stringify(err));
      }
    );
  }

  onSaveClicked() {
    console.log('onSaveClicked');
    const claim = this.mapFormGroupToClaimSave(this.formGroup);
    const claimId = this.formGroup.get('claimId').value;
    if (!claimId && claimId === '') {
      alert('Please select a recored before save!');
      return;
    }
    this.apiPatientVisitService.saveClaim(claimId, claim).subscribe(
      res => {
        alert('Claim is updated');
        this.resetFormGroup();
        this.onSearchClaimClicked();
      },
      err => {
        this.alertService.error(JSON.stringify(err));
      }
    );
  }

  onResubmitClicked(row: any) {
    console.log('onResubmitClicked');
    this.onSubmitClicked(row);
  }

  onSubmitClicked(row: any) {
    console.log('onSubmitClicked');
    const claim = this.mapRowToClaimSubmit(row);
    const claimId = claim.claimId;
    if (!claimId && claimId === '') {
      alert('Please select a recored before save!');
      return;
    }
    this.apiPatientVisitService.submitClaim(claimId, claim).subscribe(
      res => {
        alert('Claim is submitted');
        this.resetFormGroup();
        this.onSearchClaimClicked();
      },
      err => {
        this.alertService.error(JSON.stringify(err));
      }
    );
  }

  /* Data Mapper */
  mapPayloadToRows(payload: any[]) {
    const clinlic = this.store.getClinic();
    const arr = payload.map(res => {
      const doctor = this.store.findDoctorById(res.claim.claimDoctorId);
      return {
        claimId: res.claim.claimId,
        billDate: res.billDate ? moment(res.billDate, DB_FULL_DATE_FORMAT).format(DISPLAY_DATE_FORMAT) : 'N/A',
        submitDate: res.claim.submissionDateTime
          ? moment({
              y: res.claim.submissionDateTime[0],
              M: res.claim.submissionDateTime[1] - 1,
              d: res.claim.submissionDateTime[2]
            }).format(DISPLAY_DATE_FORMAT)
          : 'N/A',
        HEcode: clinlic.heCode || 'N/A',
        clinic: clinlic.clinicCode,
        patientName: res.patientName,
        payerName: res.claim.payersName,
        doctor: res.claim.claimDoctorId,
        doctorName: doctor ? doctor.displayName + ' (' + (doctor.mcr ? doctor.mcr : '---') + ')' : 'N/A',
        referNo: res.claim.claimId,
        diagnosisCode: res.claim.diagnosisCodes,
        conAmt: res.claim.consultationAmt / 100,
        drugAmt: res.claim.medicationAmt / 100,
        labAmt: res.claim.medicalTestAmt / 100,
        otherAmt: res.claim.otherAmt / 100,
        totAmt: res.totalBillAmount / 100,
        claimAmt: res.claim.claimExpectedAmt / 100,
        status: res.claim.claimStatus,
        patientNric: res.userId.number,
        payerNric: res.claim.payersNric,
        receiptNo: res.billNumber
      };
    });
    return arr;
  }

  mapFormGroupToClaimSave(formGroup: FormGroup): ClaimSave {
    return new ClaimSave(
      formGroup.get('doctor').value,
      formGroup.get('payerNric').value,
      formGroup.get('payerName').value,
      formGroup.get('diagnosisCode').value,
      formGroup.get('claimAmt').value * 100
    );
  }

  mapRowToClaimSubmit(row: any): ClaimSubmit {
    return new ClaimSubmit(
      row.doctor,
      row.payerNric,
      row.payerName,
      row.diagnosisCode,
      row.claimAmt * 100,
      row.claimId
    );
  }

  onFilterInputChanged() {
    try {
      // this.codesTypeahead
      //   .pipe(
      //     distinctUntilChanged((a, b) => b.trim().length === 0),
      //     debounceTime(400),
      //     tap(() => (this.diagnosisLoading = true)),
      //     switchMap((term: string) => {
      //       return this.apiCmsManagementService.searchDiagnosis(term, []);
      //     })
      //   )
      //   .subscribe(
      //     data => {
      //       this.diagnosisLoading = false;
      //       console.log('DATA', data);

      //       if (data) {
      //         this.codes = data.payload;
      //         // this.codes.push(data.payload);
      //       }
      //     },
      //     err => {
      //       this.diagnosisLoading = false;
      //       if (err && err.error && err.error.message) {
      //         this.alertService.error(JSON.stringify(err.error.message));
      //       }
      //     }
      //   );
    } catch (err) {
      console.log('Search Diagnosis Error', err);
    }
  }
}

class ClaimSave {
  doctorId: string;
  payerNric: string;
  payerName: string;
  diagnosisCodes: string[];
  claimAmount: number;

  constructor(
    doctorId?: string,
    payerNric?: string,
    payerName?: string,
    diagnosisCodes?: string[],
    claimAmount?: number
  ) {
    this.doctorId = doctorId;
    this.payerNric = payerNric;
    this.payerName = payerName;
    this.diagnosisCodes = diagnosisCodes;
    this.claimAmount = claimAmount;
  }
}

class ClaimSubmit {
  doctorId: string;
  payerNric: string;
  payerName: string;
  diagnosisCodes: string[];
  claimAmount: number;
  claimId: string;

  constructor(
    doctorId?: string,
    payerNric?: string,
    payerName?: string,
    diagnosisCodes?: string[],
    claimAmount?: number,
    claimId?: string
  ) {
    this.doctorId = doctorId;
    this.payerNric = payerNric;
    this.payerName = payerName;
    this.diagnosisCodes = diagnosisCodes;
    this.claimAmount = claimAmount;
    this.claimId = claimId;
  }
}
