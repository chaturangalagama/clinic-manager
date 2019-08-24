import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientConsultationComponent } from './patient-consultation.component';

describe('PatientConsultationComponent', () => {
  let component: PatientConsultationComponent;
  let fixture: ComponentFixture<PatientConsultationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientConsultationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
