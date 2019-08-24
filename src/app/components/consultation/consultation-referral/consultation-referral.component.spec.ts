import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationReferralComponent } from './consultation-referral.component';
import { SharedModule } from '../../../shared.module';
import { TestingModule } from '../../../test/testing.module';
import { ReferralItemComponent } from './referral-item/referral-item.component';
import { FormBuilder } from '../../../../../node_modules/@angular/forms';

describe('ConsultationReferralComponent', () => {
  let component: ConsultationReferralComponent;
  let fixture: ComponentFixture<ConsultationReferralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, TestingModule],
      declarations: [ConsultationReferralComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationReferralComponent);
    component = fixture.componentInstance;
    component.itemsFormArray = new FormBuilder().array([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
