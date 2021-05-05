import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchTextTextareaComponent } from './switch-text-textarea.component';

describe('SwitchTextTextareaComponent', () => {
  let component: SwitchTextTextareaComponent;
  let fixture: ComponentFixture<SwitchTextTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchTextTextareaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchTextTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
