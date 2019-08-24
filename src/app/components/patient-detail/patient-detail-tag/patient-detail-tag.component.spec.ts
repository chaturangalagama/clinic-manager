import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDetailTagComponent } from './patient-detail-tag.component';
import { TestingModule } from '../../../test/testing.module';
import { PatientService } from '../../../services/patient.service';
import { FormGroup } from '../../../../../node_modules/@angular/forms';

describe('PatientDetailTagComponent', () => {
  let component: PatientDetailTagComponent;
  let fixture: ComponentFixture<PatientDetailTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PatientDetailTagComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDetailTagComponent);
    component = fixture.componentInstance;

    const patiendDetailFormGroup = fixture.debugElement.injector.get(PatientService).createPatientDetailFormGroup();
    component.alertFormGroup = patiendDetailFormGroup.get('alertFormGroup') as FormGroup;
    component.medicalAlertFormGroup = patiendDetailFormGroup.get('medicalAlertFormGroup') as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
