import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientHistoryListComponent } from './patient-history-list.component';
import { TestingModule } from '../../../test/testing.module';
import { PatientService } from '../../../services/patient.service';
import { FormGroup } from '../../../../../node_modules/@angular/forms';

describe('PatientHistoryListComponent', () => {
  let component: PatientHistoryListComponent;
  let fixture: ComponentFixture<PatientHistoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PatientHistoryListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientHistoryListComponent);
    component = fixture.componentInstance;
    component.formGroup = fixture.debugElement.injector
      .get(PatientService)
      .createPatientDetailFormGroup()
      .get('historyListFormGroup') as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
