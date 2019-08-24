import { TestBed } from '@angular/core/testing';

import { AllergiesFormService } from './allergies-form.service';

describe('AllergiesFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AllergiesFormService = TestBed.get(AllergiesFormService);
    expect(service).toBeTruthy();
  });
});
