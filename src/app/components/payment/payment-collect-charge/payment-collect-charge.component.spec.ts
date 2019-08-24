import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCollectChargeComponent } from './payment-collect-charge.component';
import { TestingModule } from '../../../test/testing.module';
import { PaymentService } from '../../../services/payment.service';
import { FormGroup } from '../../../../../node_modules/@angular/forms';

describe('PaymentCollectChargeComponent', () => {
  let component: PaymentCollectChargeComponent;
  let fixture: ComponentFixture<PaymentCollectChargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PaymentCollectChargeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCollectChargeComponent);
    component = fixture.componentInstance;
    component.collectChargeFormGroup = fixture.debugElement.injector
      .get(PaymentService)
      .getCollectFormGroup()
      .get('collectChargeFormGroup') as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
