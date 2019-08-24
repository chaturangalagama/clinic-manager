import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalCoverageItemDetailComponent } from './medical-coverage-item-detail.component';
import { TestingModule } from '../../../../../test/testing.module';
import { SelectedPlan, MedicalCoverageSelected, CoverageSelected } from '../../../../../objects/MedicalCoverage';
import { FormBuilder } from '@angular/forms';

describe('MedicalCoverageItemDetailComponent', () => {
  let component: MedicalCoverageItemDetailComponent;
  let fixture: ComponentFixture<MedicalCoverageItemDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalCoverageItemDetailComponent);
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
