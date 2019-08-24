import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAddConfirmationComponent } from './patient-add-confirmation.component';
import { TestingModule } from '../../../test/testing.module';
import { PatientAddConsultationComponent } from '../patient-add-consultation/patient-add-consultation.component';
import { PatientAddMedicalCoverageSummaryComponent } from '../patient-add-medical-coverage-summary/patient-add-medical-coverage-summary.component';
import { PatientAddMedicalCoverageSummaryItemComponent } from '../patient-add-medical-coverage-summary/patient-add-medical-coverage-summary-item/patient-add-medical-coverage-summary-item.component';

describe('PatientAddConfirmationComponent', () => {
  let component: PatientAddConfirmationComponent;
  let fixture: ComponentFixture<PatientAddConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [
        PatientAddConfirmationComponent,
        PatientAddMedicalCoverageSummaryComponent,
        PatientAddMedicalCoverageSummaryItemComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAddConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
