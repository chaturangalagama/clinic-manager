import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsFilterComponent } from './appointments-filter.component';

describe('AppointmentsFilterComponent', () => {
  let component: AppointmentsFilterComponent;
  let fixture: ComponentFixture<AppointmentsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
