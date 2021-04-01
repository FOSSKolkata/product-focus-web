import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDragComponent } from './test-drag.component';

describe('TestDragComponent', () => {
  let component: TestDragComponent;
  let fixture: ComponentFixture<TestDragComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestDragComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
