import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWorkingArea } from './my-working-area.component';

describe('FocusComponent', () => {
  let component: MyWorkingArea;
  let fixture: ComponentFixture<MyWorkingArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyWorkingArea ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWorkingArea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
