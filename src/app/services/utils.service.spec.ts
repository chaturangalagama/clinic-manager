import { TestBed, inject } from '@angular/core/testing';

import { UtilsService } from './utils.service';
import { TestingModule } from '../test/testing.module';

describe('UtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [UtilsService]
    });
  });

  it(
    'should be created',
    inject([UtilsService], (service: UtilsService) => {
      expect(service).toBeTruthy();
    })
  );
});
