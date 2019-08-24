import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  exceptionUrl = 'aacore/login';
  authService: AuthService;

  constructor(private router: Router, private injector: Injector) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401 || err.status === 403) {
              // redirect to the login route
              // or show a modal
              console.log('ERROR: ', err.status);
              console.log('ERROR URL: ', err.url);
              if (!err.url.includes('aacore/user/login') && !err.url.includes('aacore/user/logout')) {
                if (!this.authService) {
                  this.authService = <AuthService>this.injector.get(AuthService);
                }
                this.authService.triggerLogout();
                alert('Your token is not valid and will be logged out.');
                console.log('Access Denied', err);
                this.router.navigate(['login']);
              }
              localStorage.clear();
            }
          }
        }
      )
    );
  }
}
