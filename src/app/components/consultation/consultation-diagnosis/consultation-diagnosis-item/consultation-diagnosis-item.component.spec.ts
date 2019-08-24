import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationDiagnosisItemComponent } from './consultation-diagnosis-item.component';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  FormControl
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../../../shared.module';
import { ApiCmsManagementService } from '../../../../services/api-cms-management.service';
import { AlertService } from '../../../../services/alert.service';
import { ConsultationFormService } from '../../../../services/consultation-form.service';
import { ConsultationComponentsModule } from '../../consultation-components.module';
import { StoreService } from '../../../../services/store.service';
import { TestingModule } from '../../../../test/testing.module';

describe('ConsultationDiagnosisItemComponent', () => {
  let component: ConsultationDiagnosisItemComponent;
  let fixture: ComponentFixture<ConsultationDiagnosisItemComponent>;


  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [TestingModule, ConsultationComponentsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationDiagnosisItemComponent);
    component = fixture.componentInstance;
    component.itemGroup = new FormBuilder().group({ id: new FormControl() });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
