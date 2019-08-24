import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientHistoryDetailComponent } from './patient-history-detail.component';
import { TestingModule } from '../../../test/testing.module';
import { PatientService } from '../../../services/patient.service';
import { FormGroup } from '../../../../../node_modules/@angular/forms';

describe('PatientHistoryDetailComponent', () => {
  let component: PatientHistoryDetailComponent;
  let fixture: ComponentFixture<PatientHistoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PatientHistoryDetailComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientHistoryDetailComponent);
    component = fixture.componentInstance;
    component.formGroup = fixture.debugElement.injector
      .get(PatientService)
      .createPatientDetailFormGroup()
      .get('historyDetailFormGroup') as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
