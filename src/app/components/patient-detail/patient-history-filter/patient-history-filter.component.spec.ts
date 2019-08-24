import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientHistoryFilterComponent } from './patient-history-filter.component';
import { TestingModule } from '../../../test/testing.module';
import { PatientService } from '../../../services/patient.service';
import { FormGroup } from '../../../../../node_modules/@angular/forms';

describe('PatientHistoryFilterComponent', () => {
  let component: PatientHistoryFilterComponent;
  let fixture: ComponentFixture<PatientHistoryFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PatientHistoryFilterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientHistoryFilterComponent);
    component = fixture.componentInstance;
    component.formGroup = fixture.debugElement.injector
      .get(PatientService)
      .createPatientDetailFormGroup()
      .get('historyFilterFormGroup') as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
