import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDetailDocumentComponent } from './patient-detail-document.component';
import { TestingModule } from '../../../test/testing.module';
import { PatientService } from '../../../services/patient.service';
import { FormGroup } from '../../../../../node_modules/@angular/forms';

describe('PatientDetailDocumentComponent', () => {
  let component: PatientDetailDocumentComponent;
  let fixture: ComponentFixture<PatientDetailDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PatientDetailDocumentComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDetailDocumentComponent);
    component = fixture.componentInstance;
    component.formGroup = fixture.debugElement.injector
      .get(PatientService)
      .createPatientDetailFormGroup()
      .get('documentsFormGroup') as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
