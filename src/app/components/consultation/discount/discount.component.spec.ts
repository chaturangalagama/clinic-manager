import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountComponent } from './discount.component';
import { TestingModule } from '../../../test/testing.module';
import { ConsultationFormService } from '../../../services/consultation-form.service';
import { MaxDiscountClass } from '../../../objects/response/MaxDiscount';

describe('DiscountComponent', () => {
  let component: DiscountComponent;
  let fixture: ComponentFixture<DiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountComponent);
    component = fixture.componentInstance;
    component.discountGroup = fixture.debugElement.injector
      .get(ConsultationFormService)
      .buildPriceAdjustment(0,0, 0, '', '');
    component.maxDiscount = new MaxDiscountClass();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
