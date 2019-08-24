import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQueueMedicalCoverageItemComponent } from './add-queue-medical-coverage-item.component';
import { TestingModule } from '../../../../../test/testing.module';
import { FormBuilder } from '../../../../../../../node_modules/@angular/forms';
import { Insurance } from '../../../../../objects/response/MedicalCoverageResponse';

describe('AddQueueMedicalCoverageItemComponent', () => {
  let component: AddQueueMedicalCoverageItemComponent;
  let fixture: ComponentFixture<AddQueueMedicalCoverageItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddQueueMedicalCoverageItemComponent);
    component = fixture.componentInstance;
    component.attachedMedicalCoverages = new FormBuilder().array([]);
    component.item = new Insurance();
    component.selectedCoverages = new Array();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
