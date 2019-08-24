import { TestBed, inject } from '@angular/core/testing';

import { ApiCmsManagementService } from './api-cms-management.service';
import { TestingModule } from '../test/testing.module';
import { HttpTestingController } from '@angular/common/http/testing';
import { Clinic } from '../objects/response/Clinic';

describe('ApiCmsManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ApiCmsManagementService]
    });
  });

  it(
    'should be created',
    inject([ApiCmsManagementService], (service: ApiCmsManagementService) => {
      expect(service).toBeTruthy();
    })
  );

  it(
    'can test listClinics',
    inject(
      [ApiCmsManagementService, HttpTestingController],
      (service: ApiCmsManagementService, testHttp: HttpTestingController) => {
        const testResponse = Array<Clinic>();
        testResponse.push(new Clinic());
        service.listClinics().subscribe(data => {
          expect(JSON.stringify(data)).toBe(JSON.stringify(testResponse));
        });

        const req = testHttp.expectOne(req => {
          return req.headers.has('Content-Type') && req.method === 'POST' && req.url.includes('/clinic/list/all');
        });

        // req.flush(testResponse);
        testHttp.verify();
      }
    )
  );
});
