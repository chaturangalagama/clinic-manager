import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';

import { PatientDetailBasicInfoComponent } from './patient-detail-basic-info/patient-detail-basic-info.component';
import { PatientDetailContactDetailComponent } from './patient-detail-contact-detail/patient-detail-contact-detail.component';
import { PatientDetailHeaderComponent } from './patient-detail-header/patient-detail-header.component';
import { PatientDetailTagComponent } from './patient-detail-tag/patient-detail-tag.component';
import { PatientDetailCompanyInfoComponent } from './patient-detail-company-info/patient-detail-company-info.component';
import { PatientDetailEmergencyContactComponent } from './patient-detail-emergency-contact/patient-detail-emergency-contact.component';
import { PatientDetailPrintComponent } from './patient-detail-print/patient-detail-print.component';
import { PatientDetailConsultationHistoryComponent } from './patient-detail-consultation-history/patient-detail-consultation-history.component';
import { PatientDetailDocumentComponent } from './patient-detail-document/patient-detail-document.component';
import { PatientDetailVaccinationComponent } from './patient-detail-vaccination/patient-detail-vaccination.component';
import { PatientHistoryFilterComponent } from './patient-history-filter/patient-history-filter.component';
import { PatientHistoryListComponent } from './patient-history-list/patient-history-list.component';
import { PatientHistoryDetailComponent } from './patient-history-detail/patient-history-detail.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  exports: [
    PatientDetailBasicInfoComponent,
    PatientDetailContactDetailComponent,
    PatientDetailDocumentComponent,
    PatientDetailHeaderComponent,
    PatientDetailTagComponent,
    PatientDetailCompanyInfoComponent,
    PatientDetailEmergencyContactComponent,
    PatientDetailConsultationHistoryComponent,
    PatientDetailPrintComponent,
    PatientDetailVaccinationComponent,
    PatientHistoryFilterComponent,
    PatientHistoryListComponent,
    PatientHistoryDetailComponent,
  ],
  declarations: [
    PatientDetailBasicInfoComponent,
    PatientDetailContactDetailComponent,
    PatientDetailDocumentComponent,
    PatientDetailHeaderComponent,
    PatientDetailTagComponent,
    PatientDetailCompanyInfoComponent,
    PatientDetailEmergencyContactComponent,
    PatientDetailConsultationHistoryComponent,
    PatientDetailPrintComponent,
    PatientDetailVaccinationComponent,
    PatientHistoryFilterComponent,
    PatientHistoryListComponent,
    PatientHistoryDetailComponent,
  ]
})
export class PatientDetailComponentsModule { }
