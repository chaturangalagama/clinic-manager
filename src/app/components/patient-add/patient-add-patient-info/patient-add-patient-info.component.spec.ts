import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAddPatientInfoComponent } from './patient-add-patient-info.component';
import { TestingModule } from '../../../test/testing.module';
import { PatientService } from '../../../services/patient.service';
import { FormGroup } from '../../../../../node_modules/@angular/forms';

describe('PatientAddPatientInfoComponent', () => {
  let component: PatientAddPatientInfoComponent;
  let fixture: ComponentFixture<PatientAddPatientInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PatientAddPatientInfoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAddPatientInfoComponent);
    component = fixture.componentInstance;
    component.basicInfoFormGroup = fixture.debugElement.injector
      .get(PatientService)
      .createPatientAddFormGroup()
      .get('basicInfoFormGroup') as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
