import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientVisitManagementComponent } from './patient-visit-management.component';

describe('PatientVisitManagementComponent', () => {
  let component: PatientVisitManagementComponent;
  let fixture: ComponentFixture<PatientVisitManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientVisitManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientVisitManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
