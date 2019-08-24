import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalTrendComponent } from './vital-trend.component';
import { TestingModule } from '../../../../test/testing.module';

describe('VitalTrendComponent', () => {
  let component: VitalTrendComponent;
  let fixture: ComponentFixture<VitalTrendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [ VitalTrendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
