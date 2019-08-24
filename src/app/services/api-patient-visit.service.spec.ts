import { TestBed, inject } from '@angular/core/testing';

import { ApiPatientVisitService } from './api-patient-visit.service';
import { TestingModule } from '../test/testing.module';

describe('ApiPatientVisitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ApiPatientVisitService]
    });
  });

  it(
    'should be created',
    inject([ApiPatientVisitService], (service: ApiPatientVisitService) => {
      expect(service).toBeTruthy();
    })
  );
});
