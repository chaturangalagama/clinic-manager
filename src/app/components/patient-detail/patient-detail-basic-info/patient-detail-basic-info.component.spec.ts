import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDetailBasicInfoComponent } from './patient-detail-basic-info.component';
import { TestingModule } from '../../../test/testing.module';
import { PatientService } from '../../../services/patient.service';
import { FormGroup } from '../../../../../node_modules/@angular/forms';

describe('PatientDetailBasicInfoComponent', () => {
  let component: PatientDetailBasicInfoComponent;
  let fixture: ComponentFixture<PatientDetailBasicInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PatientDetailBasicInfoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDetailBasicInfoComponent);
    component = fixture.componentInstance;
    component.basicInfoFormGroup = fixture.debugElement.injector
      .get(PatientService)
      .createPatientDetailFormGroup()
      .get('basicInfoFormGroup') as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
