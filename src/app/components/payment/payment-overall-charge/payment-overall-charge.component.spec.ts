import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOverallChargeComponent } from './payment-overall-charge.component';
import { TestingModule } from '../../../test/testing.module';
import { PaymentService } from '../../../services/payment.service';
import { FormGroup } from '../../../../../node_modules/@angular/forms';

describe('PaymentOverallChargeComponent', () => {
  let component: PaymentOverallChargeComponent;
  let fixture: ComponentFixture<PaymentOverallChargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PaymentOverallChargeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentOverallChargeComponent);
    component = fixture.componentInstance;
    component.overallChargeFormGroup = fixture.debugElement.injector
      .get(PaymentService)
      .getChargeFormGroup()
      .get('overallChargeFormGroup') as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
