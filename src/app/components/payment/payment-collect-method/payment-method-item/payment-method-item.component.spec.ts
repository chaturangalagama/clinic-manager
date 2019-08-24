import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodItemComponent } from './payment-method-item.component';
import { TestingModule } from '../../../../test/testing.module';
import { PaymentService } from '../../../../services/payment.service';

describe('PaymentMethodItemComponent', () => {
  let component: PaymentMethodItemComponent;
  let fixture: ComponentFixture<PaymentMethodItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PaymentMethodItemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentMethodItemComponent);
    component = fixture.componentInstance;
    component.paymentMethodItemFormGroup = fixture.debugElement.injector
      .get(PaymentService)
      .createPaymentMethodArrayItem();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
