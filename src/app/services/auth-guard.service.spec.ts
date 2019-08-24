import { TestBed, inject } from '@angular/core/testing';

import { AuthGuardService } from './auth-guard.service';
import { TestingModule } from '../test/testing.module';
import { AuthService } from './auth.service';

describe('AuthGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [AuthGuardService]
    });
  });

  it(
    'should be created',
    inject([AuthGuardService], (service: AuthGuardService) => {
      expect(service).toBeTruthy();
    })
  );

  it(
    'test auth guard logined',
    inject([AuthGuardService, AuthService], (service: AuthGuardService, auth: AuthService) => {
      spyOn(auth, 'isAuthenticated').and.returnValue(true);

      expect(service.canActivate()).toBeTruthy();
    })
  );

  it(
    'test auth guard not logined',
    inject([AuthGuardService, AuthService], (service: AuthGuardService, auth: AuthService) => {
      spyOn(auth, 'isAuthenticated').and.returnValue(false);

      expect(service.canActivate()).toBeFalsy();
    })
  );
});
