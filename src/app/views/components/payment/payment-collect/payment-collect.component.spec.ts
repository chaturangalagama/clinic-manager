import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCollectComponent } from './payment-collect.component';
import { TestingModule } from '../../../../test/testing.module';
import { PaymentModule } from '../payment.module';

describe('PaymentCollectComponent', () => {
  let component: PaymentCollectComponent;
  let fixture: ComponentFixture<PaymentCollectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, PaymentModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCollectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
