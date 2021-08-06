import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchTextAutocompleteComponent } from './switch-text-autocomplete.component';

describe('SwitchTextAutocompleteComponent', () => {
  let component: SwitchTextAutocompleteComponent;
  let fixture: ComponentFixture<SwitchTextAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchTextAutocompleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchTextAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
