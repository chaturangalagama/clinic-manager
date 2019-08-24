import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDetailComponent } from './patient-detail.component';
import { TestingModule } from '../../../../test/testing.module';
import { PatientModule } from '../patient.module';

describe('PatientDetailComponent', () => {
  let component: PatientDetailComponent;
  let fixture: ComponentFixture<PatientDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, PatientModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
