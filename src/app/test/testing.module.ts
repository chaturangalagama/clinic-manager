import { NgModule } from '@angular/core';
import { AppConfigService } from '../services/app-config.service';
import { StoreService } from '../services/store.service';
import { AlertService } from '../services/alert.service';
import { PatientService } from '../services/patient.service';
import { VaccinationService } from '../services/vaccination.service';
import { PaymentService } from '../services/payment.service';
import { ConsultationFormService } from '../services/consultation-form.service';
import { UtilsService } from '../services/utils.service';
import { MedicalCoverageFormService } from '../services/medical-coverage-form.service';
import { SharedModule } from '../shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxPermissionsService, NgxPermissionsModule } from 'ngx-permissions';
import { AuthService } from '../services/auth.service';
import { ApiCmsManagementService } from '../services/api-cms-management.service';
import { ApiPatientInfoService } from '../services/api-patient-info.service';
import { ApiPatientVisitService } from '../services/api-patient-visit.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { AppConfigServiceSpy } from './AppConfigServiceSpy';
import { API_DOMAIN } from '../constants/app.constants';
import { getAccessToken } from '../app.module';
import { LoggerService } from '../services/logger.service';
import { VitalService } from '../services/vital.service';
import { ConsoleLoggerService } from '../services/console-logger.service';
import { BsModalRef } from '../../../node_modules/ngx-bootstrap';
import { DatePipe } from '../../../node_modules/@angular/common';
import { PrintTemplateService } from '../services/print-template.service';
import { ErrorLogService } from '../services/error-log.service';
import { DialogService } from '../services/dialog.service';
import { PolicyHolderService } from '../services/policy-holder.service';
import { TempStoreService } from '../services/temp-store.service';

@NgModule({
  imports: [
    SharedModule,
    RouterTestingModule,
    NgxPermissionsModule.forRoot(),
    HttpClientModule,
    HttpClientTestingModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: getAccessToken,
        whitelistedDomains: API_DOMAIN
      }
    })
  ],
  providers: [
    AppConfigService,
    ApiCmsManagementService,
    ApiPatientInfoService,
    ApiPatientVisitService,
    StoreService,
    TempStoreService,
    { provide: LoggerService, useClass: ConsoleLoggerService },
    AlertService,
    AuthService,
    JwtHelperService,
    PatientService,
    VaccinationService,
    PaymentService,
    VitalService,
    ConsultationFormService,
    UtilsService,
    MedicalCoverageFormService,
    NgxPermissionsService,
    BsModalRef,
    DatePipe,
    PrintTemplateService,
    ErrorLogService,
    DialogService,
    PolicyHolderService,

    AppConfigServiceSpy
  ],
  exports: [SharedModule, RouterTestingModule, HttpClientModule, HttpClientTestingModule]
})
export class TestingModule {
  constructor(private spy: AppConfigServiceSpy) {}
}
