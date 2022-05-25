import { TestBed } from '@angular/core/testing';

import { TestRunService } from './test-run.service';

describe('TestRunService', () => {
  let service: TestRunService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestRunService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
