import { TestBed } from '@angular/core/testing';

import { VitalFormService } from './vital-form.service';

describe('VitalFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VitalFormService = TestBed.get(VitalFormService);
    expect(service).toBeTruthy();
  });
});
