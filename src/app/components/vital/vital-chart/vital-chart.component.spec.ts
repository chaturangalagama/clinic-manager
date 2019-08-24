import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalChartComponent } from './vital-chart.component';

describe('VitalChartComponent', () => {
  let component: VitalChartComponent;
  let fixture: ComponentFixture<VitalChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VitalChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
