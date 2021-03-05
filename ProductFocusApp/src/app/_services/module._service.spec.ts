import { TestBed } from '@angular/core/testing';

import { ModuleService } from './module._service';

describe('ModuleService', () => {
  let service: ModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
