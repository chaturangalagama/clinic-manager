import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientHistoryDetailAddDocumentComponent } from './patient-history-detail-add-document.component';
import { TestingModule } from '../../../../test/testing.module';
import { FileUploader } from '../../../../../../node_modules/ng2-file-upload';
import { PatientService } from '../../../../services/patient.service';
import { FormGroup } from '../../../../../../node_modules/@angular/forms';

describe('PatientHistoryDetailAddDocumentComponent', () => {
  let component: PatientHistoryDetailAddDocumentComponent;
  let fixture: ComponentFixture<PatientHistoryDetailAddDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientHistoryDetailAddDocumentComponent);
    component = fixture.componentInstance;
    component.uploader = new FileUploader({});
    component.formGroup = fixture.debugElement.injector
      .get(PatientService)
      .createPatientDetailFormGroup()
      .get('historyDetailFormGroup') as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
