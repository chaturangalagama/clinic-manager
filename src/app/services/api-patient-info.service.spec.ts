import { TestBed, inject } from '@angular/core/testing';

import { ApiPatientInfoService } from './api-patient-info.service';
import { TestingModule } from '../test/testing.module';

describe('ApiPatientInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ApiPatientInfoService]
    });
  });

  it(
    'should be created',
    inject([ApiPatientInfoService], (service: ApiPatientInfoService) => {
      expect(service).toBeTruthy();
    })
  );
});
