import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDetailVaccinationComponent } from './patient-detail-vaccination.component';
import { TestingModule } from '../../../test/testing.module';

describe('PatientDetailVaccinationComponent', () => {
  let component: PatientDetailVaccinationComponent;
  let fixture: ComponentFixture<PatientDetailVaccinationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PatientDetailVaccinationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDetailVaccinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
