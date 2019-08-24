import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDetailContactDetailComponent } from './patient-detail-contact-detail.component';
import { TestingModule } from '../../../test/testing.module';
import { PatientService } from '../../../services/patient.service';
import { FormGroup } from '../../../../../node_modules/@angular/forms';

describe('PatientDetailContactDetailComponent', () => {
  let component: PatientDetailContactDetailComponent;
  let fixture: ComponentFixture<PatientDetailContactDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PatientDetailContactDetailComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDetailContactDetailComponent);
    component = fixture.componentInstance;
    component.contactDetailFormGroup = fixture.debugElement.injector
      .get(PatientService)
      .createPatientDetailFormGroup()
      .get('contactDetailFormGroup') as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
