import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCollectMethodComponent } from './payment-collect-method.component';
import { TestingModule } from '../../../test/testing.module';
import { PaymentMethodItemComponent } from './payment-method-item/payment-method-item.component';
import { PaymentService } from '../../../services/payment.service';
import { FormGroup } from '@angular/forms';

describe('PaymentCollectMethodComponent', () => {
  let component: PaymentCollectMethodComponent;
  let fixture: ComponentFixture<PaymentCollectMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PaymentCollectMethodComponent, PaymentMethodItemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCollectMethodComponent);
    component = fixture.componentInstance;
    component.paymentFormGroup = fixture.debugElement.injector
      .get(PaymentService)
      .getCollectFormGroup()
      .get('paymentFormGroup') as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
