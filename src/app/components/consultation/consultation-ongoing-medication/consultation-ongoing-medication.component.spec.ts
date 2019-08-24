import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationOngoingMedicationComponent } from './consultation-ongoing-medication.component';

describe('ConsultationOngoingMedicationComponent', () => {
  let component: ConsultationOngoingMedicationComponent;
  let fixture: ComponentFixture<ConsultationOngoingMedicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultationOngoingMedicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationOngoingMedicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
