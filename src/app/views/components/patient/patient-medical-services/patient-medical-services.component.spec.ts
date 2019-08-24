import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMedicalServicesComponent } from './patient-medical-services.component';

describe('PatientMedicalServicesComponent', () => {
  let component: PatientMedicalServicesComponent;
  let fixture: ComponentFixture<PatientMedicalServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientMedicalServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientMedicalServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
