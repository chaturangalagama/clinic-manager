import { TestBed } from '@angular/core/testing';

import { ApiCaseManagerService } from './api-case-manager.service';

describe('ApiCaseManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiCaseManagerService = TestBed.get(ApiCaseManagerService);
    expect(service).toBeTruthy();
  });
});
