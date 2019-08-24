import { AppConfigService } from './app-config.service';
// import { API_URL } from './../constants/app.constants';
import { HttpResponseBody } from './../objects/response/HttpResponseBody';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class VaccinationService {
  private API_URL;
  constructor(private http: HttpClient, private appConfig: AppConfigService) {
    this.API_URL = appConfig.getConfig().API_URL;
  }

  listVaccination(pageNum, pageSize) {
    return this.http.post<HttpResponseBody>(
      `${this.API_URL}/cms-management-proxy/vaccination/list/${pageNum}/${pageSize}`,

      JSON.stringify({}),
      { observe: 'response' }
    );
  }

  addVaccination(patientId, body) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log('body', body);
    return this.http.post<HttpResponseBody>(
      `${this.API_URL}/cms-management-proxy/vaccination/association/add/${patientId}`,
      JSON.stringify(body),
      { observe: 'response', headers: headers }
    );
  }

  removeVaccination(patientId, vaccinationId) {
    return this.http.post<HttpResponseBody>(
      `${this.API_URL}/cms-management-proxy/vaccination/association/add/${patientId}/${vaccinationId}`,
      JSON.stringify({}),
      { observe: 'response' }
    );
  }
}
