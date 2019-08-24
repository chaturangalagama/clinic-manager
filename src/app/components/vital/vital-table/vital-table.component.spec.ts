import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalTableComponent } from './vital-table.component';

describe('VitalTableComponent', () => {
  let component: VitalTableComponent;
  let fixture: ComponentFixture<VitalTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VitalTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
