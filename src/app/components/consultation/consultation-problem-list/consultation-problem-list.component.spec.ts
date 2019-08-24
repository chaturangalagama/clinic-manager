import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationProblemListComponent } from './consultation-problem-list.component';
import { SharedModule } from '../../../shared.module';
import { TestingModule } from '../../../test/testing.module';

describe('ConsultationProblemListComponent', () => {
  let component: ConsultationProblemListComponent;
  let fixture: ComponentFixture<ConsultationProblemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, TestingModule],
      declarations: [ConsultationProblemListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationProblemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
