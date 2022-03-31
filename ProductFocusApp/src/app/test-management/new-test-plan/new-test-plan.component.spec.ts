import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTestPlanComponent } from './new-test-plan.component';

describe('NewTestPlanComponent', () => {
  let component: NewTestPlanComponent;
  let fixture: ComponentFixture<NewTestPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTestPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTestPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
