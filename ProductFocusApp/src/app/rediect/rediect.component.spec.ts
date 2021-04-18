import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RediectComponent } from './rediect.component';

describe('RediectComponent', () => {
  let component: RediectComponent;
  let fixture: ComponentFixture<RediectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RediectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RediectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
