import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDetailPrintComponent } from './patient-detail-print.component';
import { TestingModule } from '../../../test/testing.module';

describe('PatientDetailPrintComponent', () => {
  let component: PatientDetailPrintComponent;
  let fixture: ComponentFixture<PatientDetailPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PatientDetailPrintComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDetailPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
