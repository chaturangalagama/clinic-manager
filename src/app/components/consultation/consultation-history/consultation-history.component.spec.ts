import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationHistoryComponent } from './consultation-history.component';
import { ConsultationHistoryMainContainerComponent } from './consultation-history-main-container/consultation-history-main-container.component';
import { SharedModule } from '../../../shared.module';
import { ConsultationProblemListComponent } from '../consultation-problem-list/consultation-problem-list.component';
import { ConsultationDocumentsComponent } from '../consultation-documents/consultation-documents.component';
import { ConsultationHistoryItemComponent } from './consultation-history-item/consultation-history-item.component';
import { ConsultationComponentsModule } from '../consultation-components.module';
import { ApiPatientVisitService } from '../../../services/api-patient-visit.service';
import { AlertService } from '../../../services/alert.service';
import { AppConfigService } from '../../../services/app-config.service';
import { StoreService } from '../../../services/store.service';
import { LoggerService } from '../../../services/logger.service';
import { TestingModule } from '../../../test/testing.module';

describe('ConsultationHistoryComponent', () => {
  let component: ConsultationHistoryComponent;
  let fixture: ComponentFixture<ConsultationHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, ConsultationComponentsModule, TestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
