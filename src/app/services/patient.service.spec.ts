import { TestBed, inject } from '@angular/core/testing';

import { PatientService } from './patient.service';
import { TestingModule } from '../test/testing.module';

describe('PatientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [PatientService]
    });
  });

  it(
    'should be created',
    inject([PatientService], (service: PatientService) => {
      expect(service).toBeTruthy();
    })
  );
});
