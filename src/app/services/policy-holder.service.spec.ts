import { TestBed, inject } from '@angular/core/testing';

import { PolicyHolderService } from './policy-holder.service';
import { TestingModule } from '../test/testing.module';

describe('PolicyHolderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [PolicyHolderService]
    });
  });

  it(
    'should be created',
    inject([PolicyHolderService], (service: PolicyHolderService) => {
      expect(service).toBeTruthy();
    })
  );
});
