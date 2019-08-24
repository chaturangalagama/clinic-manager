import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignMedicalCoverageItemComponent } from './assign-medical-coverage-item.component';
import { TestingModule } from '../../../../../test/testing.module';
import { FormBuilder } from '../../../../../../../node_modules/@angular/forms';
import { MedicalCoverageSelected, CoverageSelected } from '../../../../../objects/MedicalCoverage';

describe('AssignMedicalCoverageItemComponent', () => {
  let component: AssignMedicalCoverageItemComponent;
  let fixture: ComponentFixture<AssignMedicalCoverageItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignMedicalCoverageItemComponent);
    component = fixture.componentInstance;
    component.medicalCoverage = new FormBuilder().group({
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
