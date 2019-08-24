import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAddMedicalCoverageSummaryItemComponent } from './patient-add-medical-coverage-summary-item.component';
import { TestingModule } from '../../../../test/testing.module';
import { FormBuilder } from '../../../../../../node_modules/@angular/forms';
import { SelectedPlan, MedicalCoverageSelected, CoverageSelected } from '../../../../objects/MedicalCoverage';

describe('PatientAddMedicalCoverageSummaryItemComponent', () => {
  let component: PatientAddMedicalCoverageSummaryItemComponent;
  let fixture: ComponentFixture<PatientAddMedicalCoverageSummaryItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PatientAddMedicalCoverageSummaryItemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAddMedicalCoverageSummaryItemComponent);
    component = fixture.componentInstance;
    component.medicalCoverageItem = new FormBuilder().group({
      patientCoverageId: '',
      isSelected: true,
      medicalCoverageId: '',
      planRows: '',
      planId: '',
      coverageSelected: new FormBuilder().group(new MedicalCoverageSelected()),
      planSelected: new FormBuilder().group(new CoverageSelected()),
      coverageType: '',
      isNew: true,
      startDate: '',
      endDate: '',
      remarks: '',
      costCenter: ''
    });
    console.log(component.medicalCoverageItem.controls);
    component.attachedMedicalCoverages = new FormBuilder().array([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
