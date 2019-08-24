import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationMedicalServicesComponent } from './consultation-medical-services.component';
import { SharedModule } from '../../../shared.module';
import { TestingModule } from '../../../test/testing.module';
import { FormBuilder } from '../../../../../node_modules/@angular/forms';
import { MedicalServiceItemComponent } from '../consultation-medical-service/medical-service-item/medical-service-item.component';
import { ConsultationImmunizationComponent } from '../consultation-immunization/consultation-immunization.component';
import { MedicalCertificateItemsArrayComponent } from '../consultation-medical-certificate/medical-certificate-items-array.component';
import { ConsultationReferralComponent } from '../consultation-referral/consultation-referral.component';
import { ConsultationMemoComponent } from '../consultation-memo/consultation-memo.component';
import { ConsultationFollowUpComponent } from '../consultation-follow-up/consultation-follow-up.component';
import { ImmunizationItemComponent } from '../consultation-immunization/immunization-item/immunization-item.component';
import { DiscountComponent } from '../discount/discount.component';
import { MedicalCertificateItemControlComponent } from '../consultation-medical-certificate/medical-certificate-item-control.component';

describe('ConsultationMedicalServicesComponent', () => {
  let component: ConsultationMedicalServicesComponent;
  let fixture: ComponentFixture<ConsultationMedicalServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, TestingModule],
      declarations: [
        ConsultationMedicalServicesComponent,
        ConsultationImmunizationComponent,
        ImmunizationItemComponent,
        MedicalCertificateItemsArrayComponent,
        ConsultationReferralComponent,
        ConsultationMemoComponent,
        ConsultationFollowUpComponent,
        MedicalCertificateItemControlComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationMedicalServicesComponent);
    component = fixture.componentInstance;
    component.mcItemsFormArray = new FormBuilder().array([]);
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
