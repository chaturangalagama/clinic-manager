import { TestBed, inject } from '@angular/core/testing';

import { ConsoleLoggerService } from './console-logger.service';
import { TestingModule } from '../test/testing.module';

describe('ConsoleLoggerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ConsoleLoggerService]
    });
  });

  it(
    'should be created',
    inject([ConsoleLoggerService], (service: ConsoleLoggerService) => {
      expect(service).toBeTruthy();
    })
  );
});
