import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDocumentationComponent } from './product-documentation.component';

describe('ProductDocumentationComponent', () => {
  let component: ProductDocumentationComponent;
  let fixture: ComponentFixture<ProductDocumentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDocumentationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDocumentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
