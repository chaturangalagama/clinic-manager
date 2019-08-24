import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalCoverageComponent } from './medical-coverage.component';
import { TestingModule } from '../../../../test/testing.module';
import { FormBuilder } from '@angular/forms';

describe('MedicalCoverageComponent', () => {
  let component: MedicalCoverageComponent;
  let fixture: ComponentFixture<MedicalCoverageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalCoverageComponent);
    component = fixture.componentInstance;
    component.patientCoverages = fixture.debugElement.injector.get(FormBuilder).array([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
