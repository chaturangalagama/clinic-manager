import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationDiagnosisComponent } from './consultation-diagnosis.component';
import { ConsultationFormService } from '../../../services/consultation-form.service';
import { ReactiveFormsModule, FormArray, FormBuilder } from '@angular/forms';
import { ConsultationComponentsModule } from '../consultation-components.module';
import { ConsultationDiagnosisItemComponent } from './consultation-diagnosis-item/consultation-diagnosis-item.component';
import { SharedModule } from '../../../shared.module';
import { TestingModule } from '../../../test/testing.module';

describe('ConsultationDiagnosisComponent', () => {
  let component: ConsultationDiagnosisComponent;
  let fixture: ComponentFixture<ConsultationDiagnosisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, TestingModule, ConsultationComponentsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationDiagnosisComponent);
    component = fixture.componentInstance;
    component.diagnosisIds = new FormBuilder().array([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
