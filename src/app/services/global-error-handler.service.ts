import { ErrorLogService } from './error-log.service';
import { Injectable, ErrorHandler, Injector } from '@angular/core';

@Injectable()
export class GlobalErrorHandlerService extends ErrorHandler {
  constructor(private errorLogService: ErrorLogService, private injector: Injector) {
    super();
  }

  handleError(error) {
    this.errorLogService.logError(error);
  }
}
