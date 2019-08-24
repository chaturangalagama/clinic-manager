import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimChasComponent } from './claim-chas.component';

describe('ClaimChasComponent', () => {
  let component: ClaimChasComponent;
  let fixture: ComponentFixture<ClaimChasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimChasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimChasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
