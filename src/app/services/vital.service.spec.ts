import { TestBed, inject } from '@angular/core/testing';

import { VitalService } from './vital.service';
import { TestingModule } from '../test/testing.module';

describe('VitalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [VitalService]
    });
  });

  it(
    'should be created',
    inject([VitalService], (service: VitalService) => {
      expect(service).toBeTruthy();
    })
  );
});
