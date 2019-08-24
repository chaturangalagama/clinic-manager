import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalComponent } from './vital.component';
import { TestingModule } from '../../../test/testing.module';
import { ConsultationFormService } from '../../../services/consultation-form.service';
import { VitalTrendComponent } from './vital-trend/vital-trend.component';

describe('VitalComponent', () => {
  let component: VitalComponent;
  let fixture: ComponentFixture<VitalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [VitalComponent, VitalTrendComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalComponent);
    component = fixture.componentInstance;
    component.vitalForm = fixture.debugElement.injector.get(ConsultationFormService).generateVitalForm();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
