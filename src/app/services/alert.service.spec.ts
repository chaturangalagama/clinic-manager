import { TestBed, inject } from '@angular/core/testing';

import { AlertService } from './alert.service';
import { TestingModule } from '../test/testing.module';

describe('AlertService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [AlertService]
    });
  });

  it(
    'should be created',
    inject([AlertService], (service: AlertService) => {
      expect(service).toBeTruthy();
    })
  );
});
