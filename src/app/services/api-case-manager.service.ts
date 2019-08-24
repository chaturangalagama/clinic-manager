import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponseBody } from '../objects/response/HttpResponseBody';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConfigService } from './app-config.service';
import { Case } from '../objects/Case';
import { Page } from '../model/page';

@Injectable()
export class ApiCaseManagerService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private API_CASE_INFO_URL;
  private API_PAYMENT_URL;

  constructor(private http: HttpClient, private appConfig: AppConfigService) {
    this.API_CASE_INFO_URL = appConfig.getConfig().API_CASE_INFO_URL;
    this.API_PAYMENT_URL = appConfig.getConfig().API_PAYMENT_URL;
  }

  create(createCase: Case): Observable<HttpResponseBody> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<HttpResponseBody>(`${this.API_CASE_INFO_URL}/case/create`, JSON.stringify(createCase), {
      headers: headers
    });
  }

  getCaseList(clinicID: string, caseBody, page: Page): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_CASE_INFO_URL}/list/all/${clinicID}/${page.pageNumber}/${page.size}`, JSON.stringify(caseBody), {
        headers: this.headers
      }
    );
  }

  update(id: string, cases: Case): Observable<HttpResponseBody> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<HttpResponseBody>(`${this.API_CASE_INFO_URL}/update/${id}`, JSON.stringify(cases), {
      headers: headers
    });
  }

  searchCase(caseId: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_CASE_INFO_URL}/search/${caseId}`, JSON.stringify({}), {
        headers: this.headers
      }
    );
  }

  closeCase(caseId: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_CASE_INFO_URL}/close/${caseId}`, JSON.stringify({}), {
        headers: this.headers
      }
    );
  }

  recordNewPayment(caseId: string, payment: any): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PAYMENT_URL}/payment/direct/${caseId}`, JSON.stringify(payment), {
        headers: this.headers
      }
    );
  }

  getPaymentTypes(): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PAYMENT_URL}/payment/modes`, JSON.stringify({}), {
        headers: this.headers
      }
    );
  }

  deletePayment(caseId: string, invoiceId: any, reason:string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PAYMENT_URL}/invoice/delete/${caseId}/${invoiceId}/${reason}`, JSON.stringify({}), {
        headers: this.headers
      }
    );
  }

  getInvoicesUpdates(caseId: string, item): Observable<HttpResponseBody> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<HttpResponseBody>(`${this.API_CASE_INFO_URL}/item/prices/${caseId}`, JSON.stringify(item),
    { headers: this.headers });
  }

  getCaseItemPrices(caseId: string, items): Observable<HttpResponseBody>{
    return this.http.post<HttpResponseBody>(
      `${this.API_CASE_INFO_URL}/item/prices/${caseId}`,
      JSON.stringify(items),
      { headers: this.headers }
    );
  }

  getInvoiceBreakdown(caseId: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PAYMENT_URL}/invoice/breakdown/${caseId}`, JSON.stringify({}), {
        headers: this.headers
      }
    );
  }

  invoiceBreakDownDynamic(caseId: string, purchaseItems: any,): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PAYMENT_URL}/invoice/breakdown-dynamic/${caseId}`, JSON.stringify(purchaseItems), {
        headers: this.headers
      }
    );
  }


  getDynamicInvoiceBreakdown(caseId: string, items): Observable<HttpResponseBody>{
    return this.http.post<HttpResponseBody>(
      `${this.API_PAYMENT_URL}/invoice/breakdown-dynamic/${caseId}`,
      JSON.stringify(items),
      { headers: this.headers }
    );
  }
}
