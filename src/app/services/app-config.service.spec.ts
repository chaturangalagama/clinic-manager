import { TestBed, inject } from '@angular/core/testing';

import { AppConfigService } from './app-config.service';
import { TestingModule } from '../test/testing.module';

describe('AppConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [AppConfigService]
    });
  });

  it(
    'should be created',
    inject([AppConfigService], (service: AppConfigService) => {
      expect(service).toBeTruthy();
    })
  );
});
