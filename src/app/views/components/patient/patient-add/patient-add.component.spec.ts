import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAddComponent } from './patient-add.component';
import { TestingModule } from '../../../../test/testing.module';
import { PatientModule } from '../patient.module';

describe('PatientAddComponent', () => {
  let component: PatientAddComponent;
  let fixture: ComponentFixture<PatientAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, PatientModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
