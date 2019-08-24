import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSelectionComponent } from './payment-selection.component';
import { TestingModule } from '../../../test/testing.module';
import { PaymentService } from '../../../services/payment.service';
import { FormGroup } from '../../../../../node_modules/@angular/forms';

describe('PaymentSelectionComponent', () => {
  let component: PaymentSelectionComponent;
  let fixture: ComponentFixture<PaymentSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSelectionComponent);
    component = fixture.componentInstance;
    component.formGroup = fixture.debugElement.injector
      .get(PaymentService)
      .getCollectFormGroup()
      .get('paymentFormGroup') as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
