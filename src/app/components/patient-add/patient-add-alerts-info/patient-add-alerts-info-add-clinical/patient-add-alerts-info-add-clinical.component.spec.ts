import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAddAlertsInfoAddClinicalComponent } from './patient-add-alerts-info-add-clinical.component';
import { TestingModule } from '../../../../test/testing.module';

describe('PatientAddAlertsInfoAddClinicalComponent', () => {
  let component: PatientAddAlertsInfoAddClinicalComponent;
  let fixture: ComponentFixture<PatientAddAlertsInfoAddClinicalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAddAlertsInfoAddClinicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
