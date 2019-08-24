import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpsComponent } from './follow-ups.component';
import { TestingModule } from '../../../../test/testing.module';

describe('FollowUpsComponent', () => {
  let component: FollowUpsComponent;
  let fixture: ComponentFixture<FollowUpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
