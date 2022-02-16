import { TestBed } from '@angular/core/testing';

import { ProductDocumentationSharedService } from './product-documentation-shared.service';

describe('ProductDocumentationSharedService', () => {
  let service: ProductDocumentationSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductDocumentationSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
