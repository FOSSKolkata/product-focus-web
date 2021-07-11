import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressCommentComponent } from './progress-comment.component';

describe('ProgressCommentComponent', () => {
  let component: ProgressCommentComponent;
  let fixture: ComponentFixture<ProgressCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
