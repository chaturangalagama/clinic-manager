import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDetailHeaderComponent } from './patient-detail-header.component';
import { TestingModule } from '../../../test/testing.module';
import { PatientService } from '../../../services/patient.service';
import { FormGroup } from '../../../../../node_modules/@angular/forms';

describe('PatientDetailHeaderComponent', () => {
  let component: PatientDetailHeaderComponent;
  let fixture: ComponentFixture<PatientDetailHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PatientDetailHeaderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDetailHeaderComponent);
    component = fixture.componentInstance;
    component.headerFormGroup = fixture.debugElement.injector
      .get(PatientService)
      .createPatientDetailFormGroup()
      .get('headerFormGroup') as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
