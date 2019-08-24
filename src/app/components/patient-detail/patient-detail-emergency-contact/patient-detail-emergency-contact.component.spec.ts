import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDetailEmergencyContactComponent } from './patient-detail-emergency-contact.component';
import { TestingModule } from '../../../test/testing.module';
import { PatientService } from '../../../services/patient.service';
import { FormGroup } from '../../../../../node_modules/@angular/forms';

describe('PatientDetailEmergencyContactComponent', () => {
  let component: PatientDetailEmergencyContactComponent;
  let fixture: ComponentFixture<PatientDetailEmergencyContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PatientDetailEmergencyContactComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDetailEmergencyContactComponent);
    component = fixture.componentInstance;
    component.emergencyContactFormGroup = fixture.debugElement.injector
      .get(PatientService)
      .createPatientDetailFormGroup()
      .get('emergencyContactFormGroup') as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
