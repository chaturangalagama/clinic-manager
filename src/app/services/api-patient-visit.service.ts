import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AttachedMedicalCoverage } from '../objects/AttachedMedicalCoverage';
import { PatientVisit } from '../objects/request/PatientVisit';
import { VitalData } from '../objects/request/VitalData';
import { HttpResponseBody } from '../objects/response/HttpResponseBody';
import { AppConfigService } from './app-config.service';
import { Page } from '../model/page';

@Injectable()
export class ApiPatientVisitService {
  // private headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('access_token')}` });
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private API_PATIENT_VISIT_URL;
  private API_DOCUMENT_URL;
  private API_INVENTORY_SYSTEM_URL;
  private API_CMS_MANAGEMENT_URL;
  private API_VITAL_URL;

  constructor(private http: HttpClient, private appConfig: AppConfigService) {
    this.API_PATIENT_VISIT_URL = appConfig.getConfig().API_PATIENT_VISIT_URL;
    this.API_DOCUMENT_URL = appConfig.getConfig().API_DOCUMENT_URL;
    this.API_INVENTORY_SYSTEM_URL = appConfig.getConfig().API_INVENTORY_SYSTEM_URL;
    this.API_CMS_MANAGEMENT_URL = appConfig.getConfig().API_CMS_MANAGEMENT_URL;
    this.API_VITAL_URL = appConfig.getConfig().API_VITAL_URL;
  }

  initCreate(patientVisit: PatientVisit): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(`${this.API_PATIENT_VISIT_URL}/create`, JSON.stringify(patientVisit), {
      headers: this.headers
    });
  }

  consult(visitId: string, doctorId: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_VISIT_URL}/update/consult/${visitId}/${doctorId}`,
      {},
      { headers: this.headers }
    );
  }

  saveConsultation(visitId: string, consultation): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_VISIT_URL}/save/consultation/${visitId}`,
      JSON.stringify(consultation),
      { headers: this.headers }
    );
  }

  postConsult(visitId: string, consultation): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_VISIT_URL}/update/post-consult/${visitId}`,
      JSON.stringify(consultation),
      { headers: this.headers }
    );
  }

  patientVisitSearch(visitId: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_VISIT_URL}/search/${visitId}`,
      {},
      { headers: this.headers }
    );
  }

  attachMedicalCoverage(caseId: string, medicalCoverages: Array<string>): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      // `${this.API_PATIENT_VISIT_URL}/attach-coverage/${patientVisitRegistryId}`,
      `${this.API_CMS_MANAGEMENT_URL}/case/update/medical-coverage/${caseId}`,
      JSON.stringify(medicalCoverages),
      { headers: this.headers }
    );
  }

  getPatientVisitHistory(patientId: string, page: number = 0, size: number = 100): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      // `${this.API_PATIENT_VISIT_URL}/patient-visit-history/${patientId}/${page}/${size}`,
      `${this.API_PATIENT_VISIT_URL}/list/${patientId}/${page}/${size}`,
      {},
      { headers: this.headers }
    );
  }

  getPatientVisitHistoryPage(patientId: string, page: Page): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_VISIT_URL}/list/${patientId}/${page.pageNumber}/${page.size}`,
      {},
      { headers: this.headers }
    );
  }

  getPatientVisitHistoryByDate(patientId: string, startDate: string, endDate: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_VISIT_URL}/patient-visit-history/by-date/${patientId}/${startDate}/${endDate}`,
      {},
      { headers: this.headers }
    );
  }

  getPatientVisitHistoryByDateAndFilter(
    patientId: string,
    searchKey: string,
    startDate: string,
    endDate: string
  ): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_VISIT_URL}/patient-visit-history/by-date/${patientId}/${searchKey}/${startDate}/${endDate}`,
      {},
      { headers: this.headers }
    );
  }

  patientRegistryList(clinicID: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_VISIT_URL}/patient-visit-history/patient-registry/${clinicID}`,
      JSON.stringify({}),
      { headers: this.headers }
    );
  }

  patientRegistryListWithStartTime(clinicID: string, from: string, to: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_VISIT_URL}/list/by-time/${clinicID}/${from}/${to}`,
      JSON.stringify({}),
      { headers: this.headers }
    );
  }

  consultationSearchByPatientVisitId(visitId: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(`${this.API_PATIENT_VISIT_URL}/search/${visitId}`, JSON.stringify({}), {
      headers: this.headers
    });
  }

  consultationCreate(patientId: string, requestPayload): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(`${this.API_PATIENT_VISIT_URL}/create`, JSON.stringify(requestPayload), {
      headers: this.headers
    });
  }

  consultationUpdate(consultationId: string, requestPayload): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_VISIT_URL}/update/consultation/${consultationId}`,
      JSON.stringify(requestPayload),
      { headers: this.headers }
    );
  }

  medicalCertificatesUpdate(consultationId: string, medicalCertificates): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_VISIT_URL}/update/certificates/${consultationId}`,
      JSON.stringify(medicalCertificates),
      { headers: this.headers }
    );
  }

  consultationSearch(patientId: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_VISIT_URL}/patient-consultation/search/${patientId}`,
      JSON.stringify({}),
      { headers: this.headers }
    );
  }

  listFollowUps(clinicId: string, startDate: string, endDate: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_VISIT_URL}/patient-consultation/list-followup/${clinicId}/${startDate}/${endDate}`,
      JSON.stringify({}),
      { headers: this.headers }
    );
  }

  payment(visitId: string, req: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(`${this.API_PATIENT_VISIT_URL}/update/payment/${visitId}`, req, {
      headers: this.headers
    });
  }

  paymentRollback(patientVisitRegistryId: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_VISIT_URL}/rollback/${patientVisitRegistryId}`,
      {},
      { headers: this.headers }
    );
  }

  billPay(patientVisitRegistryId: string, req: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_VISIT_URL}/bill-payment/pay/${patientVisitRegistryId}`,
      req,
      { headers: this.headers }
    );
  }

  completed(visitId: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_VISIT_URL}/update/complete/${visitId}`,
      JSON.stringify({}),
      { headers: this.headers }
    );
  }

  billSearch(patientVisitRegistryId: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_VISIT_URL}/bill-payment/search/${patientVisitRegistryId}`,
      JSON.stringify({}),
      { headers: this.headers }
    );
  }

  // addVital(patientId: string, data: any): Observable<HttpResponseBody> {
  //   return this.http.post<HttpResponseBody>(
  //     `${this.API_VITAL_URL}/add/${patientId}`,
  //     JSON.stringify(data),
  //     {
  //       headers: this.headers
  //     }
  //   );
  // }

  /** VITALS */
  addVitalList(vitalData: Array<VitalData>): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_CMS_MANAGEMENT_URL}/vital/add/vital/list`,
      JSON.stringify(vitalData),
      {
        headers: this.headers
      }
    );
  }

  listVital(patientId: string, startDate: string, endDate: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_CMS_MANAGEMENT_URL}/vital/list/${patientId}/${startDate}/${endDate}`,
      {},
      { headers: this.headers }
    );
  }

  modifyVital(vitalId: string, vitalData: VitalData): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_CMS_MANAGEMENT_URL}/vital/update/${vitalId}`,
      JSON.stringify(vitalData),
      { headers: this.headers }
    );
  }

  modifyVitalList(vitalData: VitalData): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_CMS_MANAGEMENT_URL}/vital/update/vital/list`,
      JSON.stringify(vitalData),
      { headers: this.headers }
    );
  }

  deleteVital(vitalId: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_CMS_MANAGEMENT_URL}/vital/remove/${vitalId}`,
      {},
      { headers: this.headers }
    );
  }
  /** VITALS */

  listDocuments(listType: string, id: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_DOCUMENT_URL}/list/${listType}/${id}`,
      {},
      { headers: this.headers }
    );
  }

  listAllFiles(patientId: string, startDate: string, endDate: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_DOCUMENT_URL}/list/patient/${patientId}/${startDate}/${endDate}`,
      {},
      { headers: this.headers }
    );
  }

  listDocumentsByVisit(visitId: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_DOCUMENT_URL}/list/visit/${visitId}`,
      {},
      { headers: this.headers }
    );
  }

  downloadDocument(visitId: string, fileId: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_DOCUMENT_URL}/download/visit/${visitId}/${fileId}`,
      {},
      { headers: this.headers, responseType: 'blob' as 'json' }
    );
  }

  uploadDocumentsByVisit(visitId: string, uploadTo: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_DOCUMENT_URL}/upload/visit/${visitId}/${uploadTo}`,
      {},
      { headers: this.headers }
    );
  }

  getInventory(clinicId: string, inventories): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_INVENTORY_SYSTEM_URL}/inventory/get-usage/${clinicId}`,
      JSON.stringify(inventories),
      { headers: this.headers }
    );
  }

  checkMhcpBalance(clinicId: string, planId: string, nric: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_VISIT_URL}/mhcp-claim/balance/${clinicId}/${planId}/${nric}`,
      {},
      { headers: this.headers }
    );
  }

  listClaimsByClinlicByDate(
    clinicId: string,
    medicalCoverageType: string,
    status: string,
    startDate: string,
    endDate: string
  ): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${
        this.API_PATIENT_VISIT_URL
      }/mhcp-claim/list-by-type/${clinicId}/${medicalCoverageType}/${status}/${startDate}/${endDate}/`,
      {},
      { headers: this.headers }
    );
  }

  saveClaim(claimId: string, claim): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_VISIT_URL}/mhcp-claim/save/${claimId}/`,
      JSON.stringify(claim),
      { headers: this.headers }
    );
  }

  submitClaim(claimId: string, claim): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_VISIT_URL}/mhcp-claim/submit/${claimId}/`,
      JSON.stringify(claim),
      { headers: this.headers }
    );
  }

  checkDrugBatchNo(clinicId: string, inventories): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_INVENTORY_SYSTEM_URL}/inventory/get-usage-with-batch-no/${clinicId}`,
      JSON.stringify(inventories),
      { headers: this.headers }
    );
  }

  getVisit(caseId): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(`${this.API_PATIENT_VISIT_URL}/list/by-case/${caseId}`, {
      headers: this.headers
    });
  }

  patientVisitList(patientId: string, date, caseId: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_VISIT_URL}/list/by-month/${patientId}/${date}/${caseId}/10`,
      {},
      { headers: this.headers }
    );
  }

  patientVisitRemove(visitId: string, caseId: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_VISIT_URL}/remove/${visitId}/${caseId}`,
      {},
      { headers: this.headers }
    );
  }

  patientVisitAttach(caseId: string, visitIds: any): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_VISIT_URL}/attach/${caseId}`,
      JSON.stringify(visitIds),
      {
        headers: this.headers
      }
    );
  }

  listQueue(clinicId: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_VISIT_URL}/list/queue/${clinicId}`,
      {},
      {
        headers: this.headers
      }
    );
  }

  nextPatient(clinicId: string, doctorId: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_VISIT_URL}/queue/next-patient/${clinicId}/${doctorId}`,
      {},
      {
        headers: this.headers
      }
    );
  }
}
