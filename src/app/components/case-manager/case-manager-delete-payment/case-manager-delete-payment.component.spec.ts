import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseManagerNewPaymentComponent } from './case-manager-delete-payment.component';

describe('CaseManagerDeletePaymentComponent', () => {
  let component: CaseManagerDeletePaymentComponent;
  let fixture: ComponentFixture<CaseManagerDeletePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseManagerDeletePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseManagerDeletePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
