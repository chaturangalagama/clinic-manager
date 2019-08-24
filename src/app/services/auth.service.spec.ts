import { TestBed, inject } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { TestingModule } from '../test/testing.module';
import { HttpTestingController } from '@angular/common/http/testing';
import { UserLogin } from '../objects/User';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [AuthService]
    });
  });

  it(
    'should be created',
    inject([AuthService], (service: AuthService) => {
      expect(service).toBeTruthy();
    })
  );

  it(
    'test login response success',
    inject([AuthService, HttpTestingController], (authService: AuthService, testHttp: HttpTestingController) => {
      const userLogin = new UserLogin('name', 'password');
      const response = { success: true };
      authService.login(userLogin).subscribe(
        res => {
          expect(res.body).toEqual(response);
        },
        error => fail('login response should be success')
      );

      const req = testHttp.expectOne(
        req => req.url.includes('/login') && req.method === 'POST' && req.body === JSON.stringify(userLogin)
      );

      req.flush(response);
      testHttp.verify();
    })
  );

  it(
    'test login response fail',
    inject([AuthService, HttpTestingController], (authService: AuthService, testHttp: HttpTestingController) => {
      const userLogin = new UserLogin('name', 'wrong_password');
      const errorMessage = 'error';
      authService.login(userLogin).subscribe(
        res => {
          fail('login response should be fail');
        },
        error => {
          expect(error.error.message).toEqual(errorMessage);
        }
      );

      const req = testHttp.expectOne(
        req => req.url.includes('/login') && req.method === 'POST' && req.body === JSON.stringify(userLogin)
      );

      req.error(
        new ErrorEvent('error', {
          message: errorMessage
        })
      );

      testHttp.verify();
    })
  );

  it(
    'get user success',
    inject([AuthService, HttpTestingController], (authService: AuthService, testHttp: HttpTestingController) => {
      const response = { user: { name: 'name' } };
      authService.getUser().subscribe(
        res => {
          expect(JSON.stringify(res)).toEqual(JSON.stringify(response));
        },
        error => fail('get user response should be success')
      );

      const req = testHttp.expectOne(req => req.url.includes('/user') && req.method === 'POST');

      req.flush(response);
      testHttp.verify();
    })
  );

  it(
    'get user fail',
    inject([AuthService, HttpTestingController], (authService: AuthService, testHttp: HttpTestingController) => {
      const errorMessage = 'error';
      authService.getUser().subscribe(
        res => {
          fail('get user response should be fail');
        },
        error => {
          expect(error.error.message).toEqual(errorMessage);
        }
      );

      const req = testHttp.expectOne(req => req.url.includes('/user') && req.method === 'POST');

      req.error(
        new ErrorEvent('error', {
          message: errorMessage
        })
      );
      testHttp.verify();
    })
  );

  it(
    'change pw success',
    inject([AuthService, HttpTestingController], (authService: AuthService, testHttp: HttpTestingController) => {
      const oldPw = 'oldPw';
      const newPw = 'newPw';
      const response = { success: true };
      authService.changePassword(oldPw, newPw).subscribe(
        res => {
          expect(JSON.stringify(res)).toEqual(JSON.stringify(response));
        },
        error => fail('change pw response should be success')
      );

      const req = testHttp.expectOne(
        req => req.url.includes(`/user/change/password/${oldPw}/${newPw}`) && req.method === 'POST'
      );

      req.flush(response);
      testHttp.verify();
    })
  );

  it(
    'change pw fail',
    inject([AuthService, HttpTestingController], (authService: AuthService, testHttp: HttpTestingController) => {
      const oldPw = 'oldPw';
      const newPw = 'newPw';
      const errorMessage = 'error';

      authService.changePassword(oldPw, newPw).subscribe(
        res => {
          fail('change pw response should be fail');
        },
        error => expect(error.error.message).toEqual(errorMessage)
      );

      const req = testHttp.expectOne(
        req => req.url.includes(`/user/change/password/${oldPw}/${newPw}`) && req.method === 'POST'
      );

      req.error(
        new ErrorEvent('error', {
          message: errorMessage
        })
      );

      testHttp.verify();
    })
  );

  it(
    'logout success',
    inject([AuthService, HttpTestingController], (authService: AuthService, testHttp: HttpTestingController) => {
      authService.logout();

      expect(localStorage.getItem('access_token')).toBeFalsy();
      expect(localStorage.getItem('clinicId')).toBeFalsy();
      expect(localStorage.getItem('clinicCode')).toBeFalsy();
    })
  );
});
