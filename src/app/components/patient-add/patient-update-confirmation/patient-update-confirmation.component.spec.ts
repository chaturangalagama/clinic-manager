import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientUpdateConfirmationComponent } from './patient-update-confirmation.component';
import { TestingModule } from '../../../test/testing.module';
import { PatientAddMedicalCoverageSummaryComponent } from '../patient-add-medical-coverage-summary/patient-add-medical-coverage-summary.component';
import { PatientAddMedicalCoverageSummaryItemComponent } from '../patient-add-medical-coverage-summary/patient-add-medical-coverage-summary-item/patient-add-medical-coverage-summary-item.component';
import { FormBuilder } from '@angular/forms';

describe('PatientUpdateConfirmationComponent', () => {
  let component: PatientUpdateConfirmationComponent;
  let fixture: ComponentFixture<PatientUpdateConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [
        PatientUpdateConfirmationComponent,
        PatientAddMedicalCoverageSummaryComponent,
        PatientAddMedicalCoverageSummaryItemComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientUpdateConfirmationComponent);
    component = fixture.componentInstance;
    component.confirmationFormGroup = fixture.debugElement.injector.get(FormBuilder).group({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
