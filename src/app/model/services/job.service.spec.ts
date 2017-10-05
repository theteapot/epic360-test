import { TestBed, inject } from '@angular/core/testing';

import { Job.ServiceService } from './job.service.service';

describe('Job.ServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Job.ServiceService]
    });
  });

  it('should be created', inject([Job.ServiceService], (service: Job.ServiceService) => {
    expect(service).toBeTruthy();
  }));
});
