import { TestBed } from '@angular/core/testing';

import { ProductDocumentationService } from './product-documentation.service';

describe('ProductDocumentationService', () => {
  let service: ProductDocumentationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductDocumentationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
