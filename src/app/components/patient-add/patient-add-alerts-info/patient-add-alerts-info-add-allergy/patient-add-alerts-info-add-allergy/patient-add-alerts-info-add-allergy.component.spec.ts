import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAddAlertsInfoAddAllergyComponent } from './patient-add-alerts-info-add-allergy.component';
import { TestingModule } from '../../../../../test/testing.module';

describe('PatientAddAlertsInfoAddAllergyComponent', () => {
  let component: PatientAddAlertsInfoAddAllergyComponent;
  let fixture: ComponentFixture<PatientAddAlertsInfoAddAllergyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PatientAddAlertsInfoAddAllergyComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAddAlertsInfoAddAllergyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
