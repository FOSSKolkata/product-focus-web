import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainEventComponent } from './domain-event.component';

describe('DomainEventComponent', () => {
  let component: DomainEventComponent;
  let fixture: ComponentFixture<DomainEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomainEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
