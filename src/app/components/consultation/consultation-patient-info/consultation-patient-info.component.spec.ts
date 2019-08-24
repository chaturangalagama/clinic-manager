import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationPatientInfoComponent } from './consultation-patient-info.component';
import { FormBuilder } from '../../../../../node_modules/@angular/forms';
import { SharedModule } from '../../../shared.module';
import { TestingModule } from '../../../test/testing.module';
import { ConsultationPatientAlertInfoComponent } from './consultation-patient-alert-info/consultation-patient-alert-info.component';

describe('ConsultationPatientInfoComponent', () => {
  let component: ConsultationPatientInfoComponent;
  let fixture: ComponentFixture<ConsultationPatientInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, TestingModule],
      declarations: [ConsultationPatientInfoComponent, ConsultationPatientAlertInfoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationPatientInfoComponent);
    component = fixture.componentInstance;
    component.selectedPlans = new FormBuilder().array([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
