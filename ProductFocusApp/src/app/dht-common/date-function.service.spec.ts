import { TestBed } from '@angular/core/testing';

import { DateFunctionService } from './date-function.service';

describe('DateFunctionService', () => {
  let service: DateFunctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateFunctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
