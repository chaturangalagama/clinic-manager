import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationSearchComponent } from './consultation-search.component';

describe('ConsultationSearchComponent', () => {
  let component: ConsultationSearchComponent;
  let fixture: ComponentFixture<ConsultationSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultationSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
