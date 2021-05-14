import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingInvitationsComponent } from './pending-invitations.component';

describe('PendingInvitationComponent', () => {
  let component: PendingInvitationsComponent;
  let fixture: ComponentFixture<PendingInvitationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingInvitationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingInvitationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
