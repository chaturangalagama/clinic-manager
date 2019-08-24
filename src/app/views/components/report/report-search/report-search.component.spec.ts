import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSearchComponent } from './report-search.component';
import { TestingModule } from '../../../../test/testing.module';

describe('ReportSearchComponent', () => {
  let component: ReportSearchComponent;
  let fixture: ComponentFixture<ReportSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [ReportSearchComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
