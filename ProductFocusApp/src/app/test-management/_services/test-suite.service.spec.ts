import { TestBed } from '@angular/core/testing';

import { TestSuiteService } from './test-suite.service';

describe('TestSuiteService', () => {
  let service: TestSuiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestSuiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
