import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRoadmapComponent } from './product-roadmap.component';

describe('ProductRoadmapComponent', () => {
  let component: ProductRoadmapComponent;
  let fixture: ComponentFixture<ProductRoadmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductRoadmapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRoadmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
