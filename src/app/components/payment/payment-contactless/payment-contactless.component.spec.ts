import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentContactlessComponent } from './payment-contactless.component';
import { TestingModule } from '../../../test/testing.module';

describe('PaymentContactlessComponent', () => {
  let component: PaymentContactlessComponent;
  let fixture: ComponentFixture<PaymentContactlessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PaymentContactlessComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentContactlessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
