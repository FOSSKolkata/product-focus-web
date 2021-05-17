import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationHistoryComponent } from './invitation-history.component';

describe('InvitationHistoryComponent', () => {
  let component: InvitationHistoryComponent;
  let fixture: ComponentFixture<InvitationHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitationHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
