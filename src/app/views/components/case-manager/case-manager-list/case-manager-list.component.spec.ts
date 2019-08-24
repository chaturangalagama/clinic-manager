import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseManagerListComponent } from './case-manager-list.component';

describe('CaseManagerComponent', () => {
  let component: CaseManagerListComponent;
  let fixture: ComponentFixture<CaseManagerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseManagerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseManagerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
