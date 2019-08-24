import { TestBed, inject } from '@angular/core/testing';

import { StoreService } from './store.service';
import { TestingModule } from '../test/testing.module';

describe('StoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [StoreService]
    });
  });

  it(
    'should be created',
    inject([StoreService], (service: StoreService) => {
      expect(service).toBeTruthy();
    })
  );
});
