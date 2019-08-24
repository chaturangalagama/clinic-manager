import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentChequeComponent } from './payment-cheque.component';
import { TestingModule } from '../../../test/testing.module';
import { PaymentService } from '../../../services/payment.service';
import { FormGroup } from '../../../../../node_modules/@angular/forms';

describe('PaymentChequeComponent', () => {
  let component: PaymentChequeComponent;
  let fixture: ComponentFixture<PaymentChequeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PaymentChequeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentChequeComponent);
    component = fixture.componentInstance;
    component.chequeFormGroup = fixture.debugElement.injector
      .get(PaymentService)
      .getCollectFormGroup()
      .get('chequeFormGroup') as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
