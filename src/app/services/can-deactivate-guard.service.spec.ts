import { TestBed, inject } from '@angular/core/testing';

import { CanDeactivateGuardService } from './can-deactivate-guard.service';
import { TestingModule } from '../test/testing.module';

describe('CanDeactivateGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [CanDeactivateGuardService]
    });
  });

  it(
    'should be created',
    inject([CanDeactivateGuardService], (service: CanDeactivateGuardService) => {
      expect(service).toBeTruthy();
    })
  );
});
