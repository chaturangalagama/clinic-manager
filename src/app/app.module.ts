import { VitalAddComponent } from './components/vital/vital-add/vital-add.component';
import { VitalModule } from './components/vital/vital.module';
import { PrintTemplateService } from './services/print-template.service';
import { VitalService } from './services/vital.service';
import { ErrorLogService } from './services/error-log.service';

import { AppConfigService } from './services/app-config.service';
import { JwtInterceptor } from './services/jwt-interceptor';
import { DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import {
  APP_SIDEBAR_NAV,
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent
} from './components';

import { FullLayoutComponent, SimpleLayoutComponent } from './containers';
import {
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
} from './directives';
import { AlertService } from './services/alert.service';
import { ApiCmsManagementService } from './services/api-cms-management.service';
import { ApiPatientInfoService } from './services/api-patient-info.service';
import { ApiPatientVisitService } from './services/api-patient-visit.service';
import { AuthGuardService } from './services/auth-guard.service';
import { PermissionsGuardService } from './services/permissions-guard.service';
import { AuthService } from './services/auth.service';
import { CanDeactivateGuardService } from './services/can-deactivate-guard.service';
import { ConsoleLoggerService } from './services/console-logger.service';
import { ConsultationFormService } from './services/consultation-form.service';
import { CaseChargeFormService } from './services/case-charge-form.service';
import { DialogService } from './services/dialog.service';
import { LoggerService } from './services/logger.service';
import { PatientService } from './services/patient.service';
import { PaymentService } from './services/payment.service';
import { PolicyHolderService } from './services/policy-holder.service';
import { StoreService } from './services/store.service';
import { UtilsService } from './services/utils.service';
import { VaccinationService } from './services/vaccination.service';
import { SharedModule } from './shared.module';
import { MedicalCoverageFormService } from './services/medical-coverage-form.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { API_DOMAIN } from './constants/app.constants';
import { TempStoreService } from './services/temp-store.service';
import { ApiCaseManagerService } from './services/api-case-manager.service';

// HTTP MODULE
// Services
// Routing
const APP_CONTAINERS = [FullLayoutComponent, SimpleLayoutComponent];

// Import components
const APP_COMPONENTS = [
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  APP_SIDEBAR_NAV
];

// Import directives
const APP_DIRECTIVES = [AsideToggleDirective, NAV_DROPDOWN_DIRECTIVES, ReplaceDirective, SIDEBAR_TOGGLE_DIRECTIVES];

export function getAccessToken() {
  return localStorage.getItem('access_token');
}

const appInitializerFn = (appConfig: AppConfigService) => {
  return () => {
    return appConfig.loadAppConfig();
  };
};

// Import 3rd party components
@NgModule({
  declarations: [AppComponent, ...APP_CONTAINERS, ...APP_COMPONENTS, ...APP_DIRECTIVES],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    HttpClientModule,
    SharedModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: getAccessToken,
        whitelistedDomains: API_DOMAIN
      }
    }),
    NgxPermissionsModule.forRoot(),
    ReactiveFormsModule,
    AppRoutingModule
  ],
  entryComponents: [],

  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AppConfigService]
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (ps: NgxPermissionsService) =>
        function() {
          return new Promise((resolve, reject) => {
            if (localStorage.getItem('roles')) {
              resolve(localStorage.getItem('roles'));
            } else {
              resolve('');
            }
          }).then((data: string) => {
            console.log('Roles Loaded', data);
            if (data) {
              return ps.loadPermissions(JSON.parse(data));
            }
          });
        },
      deps: [NgxPermissionsService],
      multi: true
    },
    { provide: LoggerService, useClass: ConsoleLoggerService },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },

    ErrorLogService,
    DatePipe,

    StoreService,
    AlertService,
    AuthService,
    VitalService,
    TempStoreService,

    ApiCmsManagementService,
    ApiPatientInfoService,
    ApiPatientVisitService,
    DialogService,
    PatientService,
    VaccinationService,
    AuthGuardService,
    PermissionsGuardService,
    CanDeactivateGuardService,
    JwtHelperService,
    PolicyHolderService,
    PaymentService,
    ConsultationFormService,
    CaseChargeFormService,
    UtilsService,
    MedicalCoverageFormService,
    BsModalService,
    NgxPermissionsService,
    PrintTemplateService,
    ApiCaseManagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
