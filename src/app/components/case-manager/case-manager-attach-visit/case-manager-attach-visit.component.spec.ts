import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseManagerAttachVisitComponent } from './case-manager-attach-visit.component';

describe('CaseManagerAttachVisitComponent', () => {
  let component: CaseManagerAttachVisitComponent;
  let fixture: ComponentFixture<CaseManagerAttachVisitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseManagerAttachVisitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseManagerAttachVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
