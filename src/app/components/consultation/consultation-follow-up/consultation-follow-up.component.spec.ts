import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationFollowUpComponent } from './consultation-follow-up.component';
import { SharedModule } from '../../../shared.module';
import { ConsultationFormService } from '../../../services/consultation-form.service';
import { FormBuilder } from '@angular/forms';

describe('ConsultationFollowUpComponent', () => {
  let component: ConsultationFollowUpComponent;
  let fixture: ComponentFixture<ConsultationFollowUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [ ConsultationFollowUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationFollowUpComponent);
    component = fixture.componentInstance;
    component.item = new ConsultationFormService(new FormBuilder).initFollowup()
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
