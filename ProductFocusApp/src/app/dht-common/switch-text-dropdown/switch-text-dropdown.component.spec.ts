import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchTextDropdownComponent } from './switch-text-dropdown.component';

describe('SwitchTextDropdownComponent', () => {
  let component: SwitchTextDropdownComponent;
  let fixture: ComponentFixture<SwitchTextDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchTextDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchTextDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
