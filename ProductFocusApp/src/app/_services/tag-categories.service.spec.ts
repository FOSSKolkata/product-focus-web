import { TestBed } from '@angular/core/testing';

import { TagCategoriesService } from './tag-categories.service';

describe('TagCategoriesService', () => {
  let service: TagCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
