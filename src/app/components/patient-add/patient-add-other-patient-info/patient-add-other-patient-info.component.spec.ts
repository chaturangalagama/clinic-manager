import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAddOtherPatientInfoComponent } from './patient-add-other-patient-info.component';
import { TestingModule } from '../../../test/testing.module';
import { PatientService } from '../../../services/patient.service';
import { FormGroup } from '../../../../../node_modules/@angular/forms';

describe('PatientAddOtherPatientInfoComponent', () => {
  let component: PatientAddOtherPatientInfoComponent;
  let fixture: ComponentFixture<PatientAddOtherPatientInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PatientAddOtherPatientInfoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAddOtherPatientInfoComponent);
    component = fixture.componentInstance;
    component.otherInfoFormGroup = fixture.debugElement.injector
      .get(PatientService)
      .createPatientAddFormGroup()
      .get('otherInfoFormGroup') as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
