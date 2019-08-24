import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationDocumentsComponent } from './consultation-documents.component';
import { ApiPatientVisitService } from '../../../services/api-patient-visit.service';
import { StoreService } from '../../../services/store.service';
import { AlertService } from '../../../services/alert.service';
import { SharedModule } from '../../../shared.module';
import { FormBuilder } from '@angular/forms';
import { TestingModule } from '../../../test/testing.module';

describe('ConsultationDocumentsComponent', () => {
  let component: ConsultationDocumentsComponent;
  let fixture: ComponentFixture<ConsultationDocumentsComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultationDocumentsComponent],
      imports: [SharedModule, TestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
