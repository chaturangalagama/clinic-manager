import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAddMedicalCoverageSummaryComponent } from './patient-add-medical-coverage-summary.component';
import { TestingModule } from '../../../test/testing.module';
import { PatientAddMedicalCoverageSummaryItemComponent } from './patient-add-medical-coverage-summary-item/patient-add-medical-coverage-summary-item.component';
import { FormBuilder } from '../../../../../node_modules/@angular/forms';

describe('PatientAddMedicalCoverageSummaryComponent', () => {
  let component: PatientAddMedicalCoverageSummaryComponent;
  let fixture: ComponentFixture<PatientAddMedicalCoverageSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PatientAddMedicalCoverageSummaryComponent, PatientAddMedicalCoverageSummaryItemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAddMedicalCoverageSummaryComponent);
    component = fixture.componentInstance;
    component.medicalCoverageFormArray = new FormBuilder().array([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
