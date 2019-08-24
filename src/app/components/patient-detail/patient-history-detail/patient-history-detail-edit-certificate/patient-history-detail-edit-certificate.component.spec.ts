import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientHistoryDetailEditCertificateComponent } from './patient-history-detail-edit-certificate.component';
import { TestingModule } from '../../../../test/testing.module';
import { FormBuilder } from '../../../../../../node_modules/@angular/forms';

describe('PatientHistoryDetailEditCertificateComponent', () => {
  let component: PatientHistoryDetailEditCertificateComponent;
  let fixture: ComponentFixture<PatientHistoryDetailEditCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientHistoryDetailEditCertificateComponent);
    component = fixture.componentInstance;
    component.certificateArray = new FormBuilder().array([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
