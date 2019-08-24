import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientHistoryDetailEditNoteComponent } from './patient-history-detail-edit-note.component';
import { TestingModule } from '../../../../test/testing.module';
import { FormControl } from '../../../../../../node_modules/@angular/forms';

describe('PatientHistoryDetailEditNoteComponent', () => {
  let component: PatientHistoryDetailEditNoteComponent;
  let fixture: ComponentFixture<PatientHistoryDetailEditNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientHistoryDetailEditNoteComponent);
    component = fixture.componentInstance;
    component.consultationNotes = new FormControl();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
