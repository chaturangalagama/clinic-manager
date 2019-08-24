import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared.module';
import { ConsultationPatientDocumentComponent } from './consultation-patient-document/consultation-patient-document.component';
import { ReferralItemComponent } from './consultation-referral/referral-item/referral-item.component';
import { ConsultationDocumentsComponent } from './consultation-documents/consultation-documents.component';
import { ConsultationMedicalServicesComponent } from './consultation-medical-services/consultation-medical-services.component';

@NgModule({
  imports: [SharedModule],
  declarations: [ConsultationPatientDocumentComponent, ConsultationMedicalServicesComponent],
  exports: [
    ConsultationPatientDocumentComponent,
    ConsultationMedicalServicesComponent,
    ReferralItemComponent,
    ConsultationDocumentsComponent
  ],
  entryComponents: []
})
export class ConsultationComponentsModule {}
