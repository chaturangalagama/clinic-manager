import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCoverageLimitComponent } from './payment-coverage-limit.component';
import { TestingModule } from '../../../test/testing.module';
import { PaymentService } from '../../../services/payment.service';
import { FormGroup } from '../../../../../node_modules/@angular/forms';

describe('PaymentCoverageLimitComponent', () => {
  let component: PaymentCoverageLimitComponent;
  let fixture: ComponentFixture<PaymentCoverageLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PaymentCoverageLimitComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCoverageLimitComponent);
    component = fixture.componentInstance;
    component.coverageLimitFormGroup = fixture.debugElement.injector
      .get(PaymentService)
      .getChargeFormGroup()
      .get('coverageLimitFormGroup') as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
