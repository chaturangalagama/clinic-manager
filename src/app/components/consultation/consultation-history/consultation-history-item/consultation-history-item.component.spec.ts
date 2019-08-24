import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationHistoryItemComponent, ConsultationHistoryItem } from './consultation-history-item.component';
import { SharedModule } from '../../../../shared.module';
import { ApiPatientVisitService } from '../../../../services/api-patient-visit.service';
import { LoggerService } from '../../../../services/logger.service';
import { AlertService } from '../../../../services/alert.service';
import { AppConfigService } from '../../../../services/app-config.service';
import { PatientVisitHistory } from '../../../../objects/request/PatientVisitHistory';
import { HttpClient } from '@angular/common/http';
import { TestingModule } from '../../../../test/testing.module';

describe('ConsultationHistoryItemComponent', () => {
  let component: ConsultationHistoryItemComponent;
  let fixture: ComponentFixture<ConsultationHistoryItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, TestingModule],
      declarations: [ConsultationHistoryItemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationHistoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
