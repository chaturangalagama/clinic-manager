import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalSignComponent } from './vital-sign.component';
import { TestingModule } from '../../../../test/testing.module';
import { ConsultationFormService } from '../../../../services/consultation-form.service';

describe('VitalSignComponent', () => {
  let component: VitalSignComponent;
  let fixture: ComponentFixture<VitalSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalSignComponent);
    component = fixture.componentInstance;
    component.vitalForm = fixture.debugElement.injector.get(ConsultationFormService).generateVitalForm()
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
