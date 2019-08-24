import { SharedModule } from '../../shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientAddAlertsInfoComponent } from './patient-add-alerts-info/patient-add-alerts-info.component';
import { PatientAddPatientInfoComponent } from './patient-add-patient-info/patient-add-patient-info.component';
import { PatientAddEmergencyContactComponent } from './patient-add-emergency-contact/patient-add-emergency-contact.component';
import { PatientAddOtherPatientInfoComponent } from './patient-add-other-patient-info/patient-add-other-patient-info.component';
import { PatientAddCompanyInfoComponent } from './patient-add-company-info/patient-add-company-info.component';
import { PatientAddConfirmationComponent } from './patient-add-confirmation/patient-add-confirmation.component';
import { PatientAddMedicalCoverageSummaryComponent } from './patient-add-medical-coverage-summary/patient-add-medical-coverage-summary.component';
import { PatientAddAlertsInfoAddAllergyComponent } from './patient-add-alerts-info/patient-add-alerts-info-add-allergy/patient-add-alerts-info-add-allergy/patient-add-alerts-info-add-allergy.component';
import { PatientAddMedicalCoverageSummaryItemComponent } from './patient-add-medical-coverage-summary/patient-add-medical-coverage-summary-item/patient-add-medical-coverage-summary-item.component';
import { PatientUpdateConfirmationComponent } from './patient-update-confirmation/patient-update-confirmation.component';
@NgModule({
  imports: [CommonModule, SharedModule],
  exports: [
    PatientAddPatientInfoComponent,
    PatientAddAlertsInfoComponent,
    PatientAddEmergencyContactComponent,
    PatientAddOtherPatientInfoComponent,
    PatientAddCompanyInfoComponent,
    PatientUpdateConfirmationComponent,
    PatientAddMedicalCoverageSummaryComponent
  ],
  declarations: [
    PatientAddPatientInfoComponent,
    PatientAddAlertsInfoComponent,
    PatientAddEmergencyContactComponent,
    PatientAddOtherPatientInfoComponent,
    PatientAddCompanyInfoComponent,
    PatientAddConfirmationComponent,
    PatientAddMedicalCoverageSummaryComponent,
    PatientAddAlertsInfoAddAllergyComponent,
    PatientAddMedicalCoverageSummaryItemComponent,
    PatientUpdateConfirmationComponent
  ],
  entryComponents: [
    PatientAddConfirmationComponent,
    PatientAddAlertsInfoAddAllergyComponent,
    PatientUpdateConfirmationComponent
  ]
})
export class PatientAddComponentsModule {}
