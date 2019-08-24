import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAddAlertsInfoComponent } from './patient-add-alerts-info.component';
import { TestingModule } from '../../../test/testing.module';
import { PatientService } from '../../../services/patient.service';
import { FormGroup } from '../../../../../node_modules/@angular/forms';

describe('PatientAddAlertsInfoComponent', () => {
  let component: PatientAddAlertsInfoComponent;
  let fixture: ComponentFixture<PatientAddAlertsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PatientAddAlertsInfoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAddAlertsInfoComponent);
    component = fixture.componentInstance;
    const patientAddFormGroup = fixture.debugElement.injector.get(PatientService).createPatientAddFormGroup();
    component.alertFormGroup = patientAddFormGroup.get('alertFormGroup') as FormGroup;
    component.medicalAlertFormGroup = patientAddFormGroup.get('medicalAlertFormGroup') as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
