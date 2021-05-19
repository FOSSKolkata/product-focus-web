import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedInvitationsComponent } from './closed-invitations.component';

describe('ClosedInvitationsComponent', () => {
  let component: ClosedInvitationsComponent;
  let fixture: ComponentFixture<ClosedInvitationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClosedInvitationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosedInvitationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
