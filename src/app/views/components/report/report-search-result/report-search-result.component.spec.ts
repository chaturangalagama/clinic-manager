import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSearchResultComponent } from './report-search-result.component';
import { TestingModule } from '../../../../test/testing.module';

describe('ReportSearchResultComponent', () => {
  let component: ReportSearchResultComponent;
  let fixture: ComponentFixture<ReportSearchResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [ReportSearchResultComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
