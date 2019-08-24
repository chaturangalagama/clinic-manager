import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReferralComponent } from './payment-referral.component';
import { TestingModule } from '../../../test/testing.module';
import { FormBuilder } from '../../../../../node_modules/@angular/forms';

describe('PaymentReferralComponent', () => {
  let component: PaymentReferralComponent;
  let fixture: ComponentFixture<PaymentReferralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PaymentReferralComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentReferralComponent);
    component = fixture.componentInstance;
    component.itemsFormArray = new FormBuilder().array([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
