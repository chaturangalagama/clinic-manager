import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

import { Logger } from './logger.service';

export let isDebugMode = !environment.production;

const noop = (): any => undefined;

@Injectable()
export class ConsoleLoggerService implements Logger {
  constructor() {}

  get info() {
    if (isDebugMode) {
      return console.info.bind(console);
    } else {
      return noop;
    }
  }

  get warn() {
    if (isDebugMode) {
      return console.warn.bind(console);
    } else {
      return noop;
    }
  }

  get error() {
    if (isDebugMode) {
      return console.error.bind(console);
    } else {
      return noop;
    }
  }

  invokeConsoleMethod(type: string, args?: any): void {
    const logFn: Function = console[type] || console.log || noop;
    logFn.apply(console, [args]);
  }
}
