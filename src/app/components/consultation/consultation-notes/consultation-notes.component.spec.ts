import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationNotesComponent } from './consultation-notes.component';
import { SharedModule } from '../../../shared.module';
import { TestingModule } from '../../../test/testing.module';
import { FormControl } from '../../../../../node_modules/@angular/forms';

describe('ConsultationNotesComponent', () => {
  let component: ConsultationNotesComponent;
  let fixture: ComponentFixture<ConsultationNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, TestingModule],
      declarations: [ConsultationNotesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationNotesComponent);
    component = fixture.componentInstance;
    component.consultationNotes = new FormControl();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
