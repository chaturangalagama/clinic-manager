import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileChangePasswordComponent } from './profile-change-password.component';
import { TestingModule } from '../../../../test/testing.module';

describe('ProfileChangePasswordComponent', () => {
  let component: ProfileChangePasswordComponent;
  let fixture: ComponentFixture<ProfileChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [ProfileChangePasswordComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
