import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQueueMedicalCoverageComponent } from './add-queue-medical-coverage.component';
import { TestingModule } from '../../../../test/testing.module';
import { FormBuilder } from '../../../../../../node_modules/@angular/forms';

describe('AddQueueMedicalCoverageComponent', () => {
  let component: AddQueueMedicalCoverageComponent;
  let fixture: ComponentFixture<AddQueueMedicalCoverageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddQueueMedicalCoverageComponent);
    component = fixture.componentInstance;
    component.medicalCoverageFormGroup = new FormBuilder().group({
      attachedMedicalCoverages: new FormBuilder().group({
        coverageId: '',
        medicalCoverageId: '',
        planId: ''
      }),
      patientCoverages: ''
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
