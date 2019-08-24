import { Injectable } from '../../../node_modules/@angular/core';
import { HttpHeaders, HttpClient } from '../../../node_modules/@angular/common/http';
import { AppConfigService } from './app-config.service';
import { Observable } from '../../../node_modules/rxjs';
import { HttpResponseBody } from '../objects/response/HttpResponseBody';

@Injectable()
export class TempStoreService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private API_CMS_MANAGEMENT_URL;
  private access_token;

  private TEMP_STORE_URL = `${this.API_CMS_MANAGEMENT_URL}/temp-store/store/`;
  private TEMP_STORE_RETRIEVE_URL = `${this.API_CMS_MANAGEMENT_URL}/temp-store/retrieve/`;
  private TEMP_STORE_REMOVE_URL = `${this.API_CMS_MANAGEMENT_URL}/temp-store/remove/`;

  constructor(private http: HttpClient, private appConfig: AppConfigService) {
    this.API_CMS_MANAGEMENT_URL = appConfig.getConfig().API_CMS_MANAGEMENT_URL;

    this.access_token = `Bearer ${localStorage.getItem('access_token')}`;

    this.TEMP_STORE_URL = `${this.API_CMS_MANAGEMENT_URL}/temp-store/store/`;
    this.TEMP_STORE_RETRIEVE_URL = `${this.API_CMS_MANAGEMENT_URL}/temp-store/retrieve/`;
    this.TEMP_STORE_REMOVE_URL = `${this.API_CMS_MANAGEMENT_URL}/temp-store/remove/`;
  }

  tempStore(key: string, data: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(`${this.TEMP_STORE_URL}${key}`, data, {
      headers: this.headers
    });
  }

  tempStoreRetrieve(key: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(`${this.TEMP_STORE_RETRIEVE_URL}${key}`, {}, { headers: this.headers });
  }

  tempStoreRemove(key: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(`${this.TEMP_STORE_REMOVE_URL}${key}`, {}, { headers: this.headers });
  }

  tempStoreInSync(key: string, data: string): string {
    return this.apiCallInSync(`${this.TEMP_STORE_URL}${key}`, data);
  }

  tempStoreRetrieveInSync(key: string): string {
    return this.apiCallInSync(`${this.TEMP_STORE_RETRIEVE_URL}${key}`);
  }

  tempStoreRemoveInSync(key: string): string {
    return this.apiCallInSync(`${this.TEMP_STORE_REMOVE_URL}${key}`);
  }

  private apiCallInSync(url: string, data: string = ''): string {
    let http = new XMLHttpRequest();
    http.overrideMimeType('application/json');
    http.open('POST', url, false);
    http.setRequestHeader('Content-type', 'application/json');
    http.setRequestHeader('Authorization', this.access_token);
    http.send(data);
    return http.responseText;
  }
}
