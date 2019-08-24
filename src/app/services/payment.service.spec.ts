import { TestBed, inject } from '@angular/core/testing';

import { PaymentService } from './payment.service';
import { TestingModule } from '../test/testing.module';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

describe('PaymentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [PaymentService]
    });
  });

  it(
    'should be created',
    inject([PaymentService], (service: PaymentService) => {
      expect(service).toBeTruthy();
    })
  );

  it(
    'check payment method array item formgroup',
    inject([PaymentService], (service: PaymentService) => {
      const payType = 'CASH';
      const item = service.createPaymentMethodArrayItem(payType);

      const expectedFormGroup = new FormBuilder().group({
        payment: payType,
        amount: [0, Validators.required],
        transactionId: '',
        bank: ''
      });

      expect(item.value).toEqual(expectedFormGroup.value);
    })
  );
});
