import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicNotesComponent } from './clinic-notes.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

describe('ClinicNotesComponent', () => {
  let component: ClinicNotesComponent;
  let fixture: ComponentFixture<ClinicNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClinicNotesComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicNotesComponent);
    component = fixture.componentInstance;
    component.clinicNotes = new FormControl()
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
