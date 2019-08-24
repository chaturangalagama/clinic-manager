import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDispensingComponent } from './patient-dispensing.component';

describe('PatientDispensingComponent', () => {
  let component: PatientDispensingComponent;
  let fixture: ComponentFixture<PatientDispensingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientDispensingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDispensingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
