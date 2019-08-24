import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingRetryComponent } from './loading-retry.component';
import { TestingModule } from '../../test/testing.module';

describe('LoadingRetryComponent', () => {
  let component: LoadingRetryComponent;
  let fixture: ComponentFixture<LoadingRetryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingRetryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
