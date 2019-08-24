import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalCoverageItemComponent } from './medical-coverage-item.component';
import { TestingModule } from '../../../../../test/testing.module';
import { SelectedPlan, MedicalCoverageSelected, CoverageSelected } from '../../../../../objects/MedicalCoverage';
import { FormBuilder } from '@angular/forms';

describe('MedicalCoverageItemComponent', () => {
  let component: MedicalCoverageItemComponent;
  let fixture: ComponentFixture<MedicalCoverageItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalCoverageItemComponent);
    component = fixture.componentInstance;
    const plan = new SelectedPlan(
      false,
      '',
      '',
      '',
      '',
      new MedicalCoverageSelected(),
      new CoverageSelected(),
      '',
      '',
      '',
      '',
      true,
      ''
    );

    component.patientCoverageItem = fixture.debugElement.injector.get(FormBuilder).group(plan);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
