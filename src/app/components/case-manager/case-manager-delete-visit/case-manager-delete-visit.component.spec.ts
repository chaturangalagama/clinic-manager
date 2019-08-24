import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseManagerDeleteVisitComponent } from './case-manager-delete-visit.component';

describe('CaseManagerDeleteVisitComponent', () => {
  let component: CaseManagerDeleteVisitComponent;
  let fixture: ComponentFixture<CaseManagerDeleteVisitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseManagerDeleteVisitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseManagerDeleteVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
