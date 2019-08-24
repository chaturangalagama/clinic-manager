import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPrintChargeComponent } from './payment-print-charge.component';
import { TestingModule } from '../../../test/testing.module';
import { PaymentService } from '../../../services/payment.service';

describe('PaymentPrintChargeComponent', () => {
  let component: PaymentPrintChargeComponent;
  let fixture: ComponentFixture<PaymentPrintChargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PaymentPrintChargeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPrintChargeComponent);
    component = fixture.componentInstance;
    component.collectFormGroup = fixture.debugElement.injector.get(PaymentService).getCollectFormGroup();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
