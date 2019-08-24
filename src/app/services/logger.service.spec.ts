import { TestBed, inject } from '@angular/core/testing';

import { LoggerService } from './logger.service';
import { TestingModule } from '../test/testing.module';

describe('LoggerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [LoggerService]
    });
  });

  it(
    'should be created',
    inject([LoggerService], (service: LoggerService) => {
      expect(service).toBeTruthy();
    })
  );
});
