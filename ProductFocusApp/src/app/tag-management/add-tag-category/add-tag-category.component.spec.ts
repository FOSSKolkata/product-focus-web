import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTagCategoryComponent } from './add-tag-category.component';

describe('AddTagCategoryComponent', () => {
  let component: AddTagCategoryComponent;
  let fixture: ComponentFixture<AddTagCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTagCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTagCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
