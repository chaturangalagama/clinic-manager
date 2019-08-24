import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class DialogService {
  constructor() {}

  confirm(message?: string): Observable<boolean> {
    const confirmation = window.confirm(message || 'Are you sure?');

    return of(confirmation);
  }
}
