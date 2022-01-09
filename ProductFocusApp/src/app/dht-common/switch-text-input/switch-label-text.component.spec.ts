import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchLabelTextComponent } from './switch-label-text.component';

describe('SwitchTextInputComponent', () => {
  let component: SwitchLabelTextComponent;
  let fixture: ComponentFixture<SwitchLabelTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchLabelTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchLabelTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
