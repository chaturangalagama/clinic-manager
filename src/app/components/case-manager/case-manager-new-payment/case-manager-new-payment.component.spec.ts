import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseManagerNewPaymentComponent } from './case-manager-new-payment.component';

describe('CaseManagerNewPaymentComponent', () => {
  let component: CaseManagerNewPaymentComponent;
  let fixture: ComponentFixture<CaseManagerNewPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseManagerNewPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseManagerNewPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
