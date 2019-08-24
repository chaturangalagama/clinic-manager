import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDetailTagAddAlertComponent } from './patient-detail-tag-add-alert.component';
import { TestingModule } from '../../../../test/testing.module';
import { FormBuilder } from '../../../../../../node_modules/@angular/forms';

describe('PatientDetailTagAddAlertComponent', () => {
  let component: PatientDetailTagAddAlertComponent;
  let fixture: ComponentFixture<PatientDetailTagAddAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDetailTagAddAlertComponent);
    component = fixture.componentInstance;
    component.alertFormGroup = new FormBuilder().group({
      alertArray: new FormBuilder().array([]),
      state: '',
      isAdd: false,
      specialNotes: '',
      requiredSave: false
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
