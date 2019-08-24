import { TestBed, inject } from '@angular/core/testing';

import { MedicalCoverageFormService } from './medical-coverage-form.service';
import { TestingModule } from '../test/testing.module';

describe('MedicalCoverageFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [MedicalCoverageFormService]
    });
  });

  it(
    'should be created',
    inject([MedicalCoverageFormService], (service: MedicalCoverageFormService) => {
      expect(service).toBeTruthy();
    })
  );
});
