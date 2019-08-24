import { TestBed, inject } from '@angular/core/testing';

import { GlobalErrorHandlerService } from './global-error-handler.service';
import { TestingModule } from '../test/testing.module';

describe('GlobalErrorHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [GlobalErrorHandlerService]
    });
  });

  it(
    'should be created',
    inject([GlobalErrorHandlerService], (service: GlobalErrorHandlerService) => {
      expect(service).toBeTruthy();
    })
  );
});
