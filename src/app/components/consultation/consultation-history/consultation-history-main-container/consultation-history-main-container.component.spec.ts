import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationHistoryMainContainerComponent } from './consultation-history-main-container.component';
import { ApiPatientVisitService } from '../../../../services/api-patient-visit.service';
import { SharedModule } from '../../../../shared.module';
import { ConsultationHistoryItemComponent } from '../consultation-history-item/consultation-history-item.component';
import { TestingModule } from '../../../../test/testing.module';

describe('ConsultationHistoryMainContainerComponent', () => {
  let component: ConsultationHistoryMainContainerComponent;
  let fixture: ComponentFixture<ConsultationHistoryMainContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, TestingModule],
      declarations: [ConsultationHistoryMainContainerComponent, ConsultationHistoryItemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationHistoryMainContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
