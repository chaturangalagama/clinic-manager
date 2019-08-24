import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFollowUpComponent } from './payment-follow-up.component';
import { TestingModule } from '../../../test/testing.module';
import { PaymentService } from '../../../services/payment.service';
import { FormGroup } from '../../../../../node_modules/@angular/forms';

describe('PaymentFollowUpComponent', () => {
  let component: PaymentFollowUpComponent;
  let fixture: ComponentFixture<PaymentFollowUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PaymentFollowUpComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentFollowUpComponent);
    component = fixture.componentInstance;
    component.followUpFormGroup = fixture.debugElement.injector
      .get(PaymentService)
      .getChargeFormGroup()
      .get('prescriptionFormGroup')
      .get('followUpFormGroup') as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
