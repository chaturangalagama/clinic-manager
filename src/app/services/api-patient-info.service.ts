import { AppConfigService } from './app-config.service';
import { AlertService } from './alert.service';
import { Observable, timer, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HttpResponseBody } from '../objects/response/HttpResponseBody';
import { UserRegistration } from '../objects/UserRegistration';
import { map } from 'rxjs/operators';

@Injectable()
export class ApiPatientInfoService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private API_PATIENT_INFO_URL;

  constructor(private http: HttpClient, private alertService: AlertService, private appConfig: AppConfigService) {
    this.API_PATIENT_INFO_URL = appConfig.getConfig().API_PATIENT_INFO_URL;
  }

  // Patient Info
  register(user: UserRegistration): Observable<HttpResponseBody> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<HttpResponseBody>(`${this.API_PATIENT_INFO_URL}/patient/register`, JSON.stringify(user), {
      headers: headers
    });
  }

  update(id: string, user: UserRegistration): Observable<HttpResponseBody> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<HttpResponseBody>(`${this.API_PATIENT_INFO_URL}/patient/update/${id}`, JSON.stringify(user), {
      headers: headers
    });
  }

  search(searchString: string): Observable<HttpResponseBody> {
    return this.http
      .post<HttpResponseBody>(`${this.API_PATIENT_INFO_URL}/patient/like-search/${searchString}`, JSON.stringify({}), {
        observe: 'response'
      })
      .pipe(
        map(res => {
          // console.log('RES', res.body);
          return res.body;
        })
      );
  }

  searchBy(type: string, value: string): Observable<HttpResponseBody> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_INFO_URL}/patient/search/${type}/${value}`,
      JSON.stringify({}),
      {
        headers: headers
      }
    );
  }

  validateID(value: string): Observable<HttpResponseBody> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_INFO_URL}/patient/validate/${value}`,
      JSON.stringify({}),
      {
        headers: headers
      }
    );
  }

  // Medical Alert
  updateAlerts(patientId: string, addAlertsArray, trashAlertsArray) {
    const source = timer(500);

    const subscribe = source.subscribe(val => {
      this.deleteAlert(trashAlertsArray).subscribe(
        arr => {
          console.log('REMOVED ALERTS', trashAlertsArray);
        },
        err => this.alertService.error(JSON.stringify(err.error['message']))
      );
    });

    this.addAlert(patientId, addAlertsArray).subscribe(
      arr => {
        console.log('ADDED ALERTS', arr);
      },
      err => this.alertService.error(JSON.stringify(err.error['message']))
    );
  }

  addAlert(patientId: string, medicalAlert): Observable<HttpResponseBody> {
    if (medicalAlert.length > 0) {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      return this.http.post<HttpResponseBody>(
        `${this.API_PATIENT_INFO_URL}/medical-alerts/add/${patientId}`,
        JSON.stringify(medicalAlert),
        {
          headers: headers
        }
      );
    } else {
      return of(null);
    }
  }

  listAlert(patientId: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_INFO_URL}/medical-alerts/list/${patientId}`,
      JSON.stringify({}),
      {
        headers: this.headers
      }
    );
  }

  deleteAlert(medicalAlert): Observable<HttpResponseBody> {
    if (medicalAlert.length > 0) {
      return this.http.post<HttpResponseBody>(
        `${this.API_PATIENT_INFO_URL}/medical-alerts/delete`,
        JSON.stringify(medicalAlert),
        {
          headers: this.headers
        }
      );
    } else {
      return of(null);
    }
  }
  
  // Policy Holder
  assignPolicy(coverageType, body): Observable<HttpResponseBody> {
    console.log('assignPolicy() body', body);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log('body:::::', body);
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_INFO_URL}/policyholder/add/${coverageType}`,
      JSON.stringify(body),
      {
        headers: headers
      }
    );
  }

  removePolicy(policyHolderId, coverageType, medicalCoverageId, planId): Observable<HttpResponseBody> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<HttpResponseBody>(
      `${
        this.API_PATIENT_INFO_URL
      }/policyholder/remove/${policyHolderId}/${coverageType}/${medicalCoverageId}/${planId}`,
      JSON.stringify({}),
      { headers: headers }
    );
  }

  searchAssignedPoliciesByUserId(body): Observable<HttpResponseBody> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_INFO_URL}/policyholder/search-by-user-id`,
      JSON.stringify(body),
      {
        headers: headers
      }
    );
  }

  editPolicy(policyHolderType, policyHolderId, body): Observable<HttpResponseBody> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_INFO_URL}/policyholder/edit/${policyHolderType}/${policyHolderId}`,
      JSON.stringify(body),
      {
        headers: headers
      }
    );
  }

  // Allergy Management
  listAllergyGroups(): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_INFO_URL}/allergy-management/list/groups`,
      JSON.stringify({}),
      {
        headers: this.headers
      }
    );
  }

  checkAllergies(patientId: string, allergyArray: string[]): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_INFO_URL}/allergy-management/check/allergies/${patientId}`,
      JSON.stringify(allergyArray),
      { headers: this.headers }
    );
  }

  // Notifications
  createNotification(username: string, type: string, priority: string, message: string) {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_INFO_URL}/notification/create`,
      JSON.stringify({
        username,
        addedBy: type,
        priority,
        message
      }),
      { headers: this.headers }
    );
  }

  listNotifications(): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_INFO_URL}/notification/list/true`,
      {},
      { headers: this.headers }
    );
  }

  markNotificationAsRead(notificationId: string): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      `${this.API_PATIENT_INFO_URL}/notification/mark-read/${notificationId}`,
      {},
      { headers: this.headers }
    );
  }
}
