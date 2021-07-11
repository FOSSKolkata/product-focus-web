import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchTextInputComponent } from './switch-text-input.component';

describe('SwitchTextInputComponent', () => {
  let component: SwitchTextInputComponent;
  let fixture: ComponentFixture<SwitchTextInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchTextInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
