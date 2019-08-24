import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAddEmergencyContactComponent } from './patient-add-emergency-contact.component';
import { TestingModule } from '../../../test/testing.module';
import { PatientService } from '../../../services/patient.service';
import { FormGroup } from '../../../../../node_modules/@angular/forms';

describe('PatientAddEmergencyContactComponent', () => {
  let component: PatientAddEmergencyContactComponent;
  let fixture: ComponentFixture<PatientAddEmergencyContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PatientAddEmergencyContactComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAddEmergencyContactComponent);
    component = fixture.componentInstance;
    component.emergencyContactFormGroup = fixture.debugElement.injector
      .get(PatientService)
      .createPatientAddFormGroup()
      .get('emergencyContactFormGroup') as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
