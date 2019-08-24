import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationPatientDocumentComponent } from './consultation-patient-document.component';
import { SharedModule } from '../../../shared.module';
import { TestingModule } from '../../../test/testing.module';

describe('ConsultationPatientDocumentComponent', () => {
  let component: ConsultationPatientDocumentComponent;
  let fixture: ComponentFixture<ConsultationPatientDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, TestingModule],
      declarations: [ConsultationPatientDocumentComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationPatientDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
