import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDocumentationDetailsComponent } from './product-documentation-details.component';

describe('ProductDocumentationDetailsComponent', () => {
  let component: ProductDocumentationDetailsComponent;
  let fixture: ComponentFixture<ProductDocumentationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDocumentationDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDocumentationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
