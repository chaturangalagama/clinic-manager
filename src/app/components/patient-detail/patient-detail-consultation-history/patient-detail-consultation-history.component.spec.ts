import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDetailConsultationHistoryComponent } from './patient-detail-consultation-history.component';
import { TestingModule } from '../../../test/testing.module';
import { PatientService } from '../../../services/patient.service';
import { FormGroup } from '../../../../../node_modules/@angular/forms';

describe('PatientDetailConsultationHistoryComponent', () => {
  let component: PatientDetailConsultationHistoryComponent;
  let fixture: ComponentFixture<PatientDetailConsultationHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PatientDetailConsultationHistoryComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDetailConsultationHistoryComponent);
    component = fixture.componentInstance;
    component.consultationFormGroup = fixture.debugElement.injector
      .get(PatientService)
      .createPatientDetailFormGroup()
      .get('consultationFormGroup') as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
