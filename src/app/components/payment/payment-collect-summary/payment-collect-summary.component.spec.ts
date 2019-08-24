import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCollectSummaryComponent } from './payment-collect-summary.component';
import { TestingModule } from '../../../test/testing.module';
import { PaymentService } from '../../../services/payment.service';
import { FormGroup } from '@angular/forms';

describe('PaymentCollectSummaryComponent', () => {
  let component: PaymentCollectSummaryComponent;
  let fixture: ComponentFixture<PaymentCollectSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PaymentCollectSummaryComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCollectSummaryComponent);
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
