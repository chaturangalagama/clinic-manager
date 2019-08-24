import { TestBed, inject } from '@angular/core/testing';
import { TestingModule } from '../test/testing.module';
import { CaseChargeFormService } from './case-charge-form.service';

describe('CaseChargeFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [CaseChargeFormService]
    });
  });

  it(
    'should be created',
    inject([CaseChargeFormService], (service: CaseChargeFormService) => {
      expect(service).toBeTruthy();
    })
  );
});
