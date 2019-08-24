import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPrintComponent } from './payment-print.component';
import { TestingModule } from '../../../test/testing.module';
import { PaymentService } from '../../../services/payment.service';

describe('PaymentPrintComponent', () => {
  let component: PaymentPrintComponent;
  let fixture: ComponentFixture<PaymentPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PaymentPrintComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPrintComponent);
    component = fixture.componentInstance;
    component.chargeFormGroup = fixture.debugElement.injector.get(PaymentService).getChargeFormGroup();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
