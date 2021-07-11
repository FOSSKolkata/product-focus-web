import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchTextDatepickComponent } from './switch-text-datepick.component';

describe('SwitchTextDatepickComponent', () => {
  let component: SwitchTextDatepickComponent;
  let fixture: ComponentFixture<SwitchTextDatepickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchTextDatepickComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchTextDatepickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
