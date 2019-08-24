import { TestBed, inject } from '@angular/core/testing';

import { ConsultationFormService } from './consultation-form.service';
import { TestingModule } from '../test/testing.module';

describe('ConsultationFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ConsultationFormService]
    });
  });

  it(
    'should be created',
    inject([ConsultationFormService], (service: ConsultationFormService) => {
      expect(service).toBeTruthy();
    })
  );
});
