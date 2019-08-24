import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationPatientAlertInfoComponent } from './consultation-patient-alert-info.component';
import { SharedModule } from '../../../../shared.module';
import { TestingModule } from '../../../../test/testing.module';

describe('ConsultationPatientAlertInfoComponent', () => {
  let component: ConsultationPatientAlertInfoComponent;
  let fixture: ComponentFixture<ConsultationPatientAlertInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, TestingModule],
      declarations: [ConsultationPatientAlertInfoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationPatientAlertInfoComponent);
    component = fixture.componentInstance;
    component.alerts = new Array();
    component.medicalAlerts = new Array();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
