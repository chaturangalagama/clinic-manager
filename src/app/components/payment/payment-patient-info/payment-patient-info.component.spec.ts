import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPatientInfoComponent } from './payment-patient-info.component';
import { TestingModule } from '../../../test/testing.module';
import { PaymentService } from '../../../services/payment.service';
import { FormGroup } from '../../../../../node_modules/@angular/forms';

describe('PaymentPatientInfoComponent', () => {
  let component: PaymentPatientInfoComponent;
  let fixture: ComponentFixture<PaymentPatientInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PaymentPatientInfoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPatientInfoComponent);
    component = fixture.componentInstance;
    component.patientInfoFormGroup = fixture.debugElement.injector
      .get(PaymentService)
      .getChargeFormGroup()
      .get('patientInfoFormGroup') as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
