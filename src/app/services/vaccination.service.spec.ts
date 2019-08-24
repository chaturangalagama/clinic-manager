import { TestBed, inject } from '@angular/core/testing';

import { VaccinationService } from './vaccination.service';
import { TestingModule } from '../test/testing.module';

describe('VaccinationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [VaccinationService]
    });
  });

  it(
    'should be created',
    inject([VaccinationService], (service: VaccinationService) => {
      expect(service).toBeTruthy();
    })
  );
});
