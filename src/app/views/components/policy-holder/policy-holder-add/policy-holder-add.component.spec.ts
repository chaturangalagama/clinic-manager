import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyHolderAddComponent } from './policy-holder-add.component';
import { TestingModule } from '../../../../test/testing.module';

describe('PolicyHolderAddComponent', () => {
  let component: PolicyHolderAddComponent;
  let fixture: ComponentFixture<PolicyHolderAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [PolicyHolderAddComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyHolderAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
