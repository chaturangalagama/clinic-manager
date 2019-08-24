import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionItemComponent } from './prescription-item.component';
import { SharedModule } from '../../../../shared.module';
import { TestingModule } from '../../../../test/testing.module';
import { TouchedObjectDirective } from '../../../../directives/touched/touched.object.directive';
import { DiscountComponent } from '../../discount/discount.component';
import { FormBuilder, FormGroup } from '../../../../../../node_modules/@angular/forms';
import { ConsultationFormService } from '../../../../services/consultation-form.service';

describe('PrescriptionItemComponent', () => {
  let component: PrescriptionItemComponent;
  let fixture: ComponentFixture<PrescriptionItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, TestingModule],
      declarations: [PrescriptionItemComponent, TouchedObjectDirective]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionItemComponent);
    component = fixture.componentInstance;
    component.index = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
