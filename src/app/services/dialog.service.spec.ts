import { TestBed, inject } from '@angular/core/testing';

import { DialogService } from './dialog.service';
import { TestingModule } from '../test/testing.module';

describe('DialogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [DialogService]
    });
  });

  it(
    'should be created',
    inject([DialogService], (service: DialogService) => {
      expect(service).toBeTruthy();
    })
  );
});
