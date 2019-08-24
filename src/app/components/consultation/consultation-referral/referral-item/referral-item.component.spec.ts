import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralItemComponent } from './referral-item.component';
import { SharedModule } from '../../../../shared.module';
import { TestingModule } from '../../../../test/testing.module';
import { ReactiveFormsModule, FormGroup } from '../../../../../../node_modules/@angular/forms';
import { ConsultationFormService } from '../../../../services/consultation-form.service';

describe('ReferralItemComponent', () => {
  let component: ReferralItemComponent;
  let fixture: ComponentFixture<ReferralItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralItemComponent);
    component = fixture.componentInstance;
    component.referralItem = fixture.debugElement.injector.get(ConsultationFormService).initPatientReferral()
      .controls[0] as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
