import { TestBed, inject } from '@angular/core/testing';

import { PrintTemplateService } from './print-template.service';
import { TestingModule } from '../test/testing.module';

describe('PrintTemplateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [PrintTemplateService]
    });
  });

  it(
    'should be created',
    inject([PrintTemplateService], (service: PrintTemplateService) => {
      expect(service).toBeTruthy();
    })
  );
});
