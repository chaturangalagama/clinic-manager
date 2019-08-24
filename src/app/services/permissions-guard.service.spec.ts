import { TestBed, inject } from '@angular/core/testing';

import { PermissionsGuardService } from './permissions-guard.service';
import { TestingModule } from '../test/testing.module';

describe('PermissionsGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [PermissionsGuardService]
    });
  });

  it(
    'should be created',
    inject([PermissionsGuardService], (service: PermissionsGuardService) => {
      expect(service).toBeTruthy();
    })
  );
});
