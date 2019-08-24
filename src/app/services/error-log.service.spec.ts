import { TestBed, inject } from '@angular/core/testing';

import { ErrorLogService } from './error-log.service';
import { TestingModule } from '../test/testing.module';

describe('ErrorLogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ErrorLogService]
    });
  });

  it(
    'should be created',
    inject([ErrorLogService], (service: ErrorLogService) => {
      expect(service).toBeTruthy();
    })
  );
});
