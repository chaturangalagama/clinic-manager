import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseManagerCloseCaseComponent } from './case-manager-close-case.component';

describe('CaseManagerCloseCaseComponent', () => {
  let component: CaseManagerCloseCaseComponent;
  let fixture: ComponentFixture<CaseManagerCloseCaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseManagerCloseCaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseManagerCloseCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
