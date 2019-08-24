import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDetailCompanyInfoComponent } from './patient-detail-company-info.component';
import { TestingModule } from '../../../test/testing.module';
import { PatientService } from '../../../services/patient.service';
import { FormGroup } from '../../../../../node_modules/@angular/forms';

describe('PatientDetailCompanyInfoComponent', () => {
  let component: PatientDetailCompanyInfoComponent;
  let fixture: ComponentFixture<PatientDetailCompanyInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PatientDetailCompanyInfoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDetailCompanyInfoComponent);
    component = fixture.componentInstance;
    component.companyInfoFormGroup = fixture.debugElement.injector
      .get(PatientService)
      .createPatientDetailFormGroup()
      .get('companyInfoFormGroup') as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
