import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessRequirementDetailsComponent } from './business-requirement-details.component';

describe('BusinessRequirementDetailsComponent', () => {
  let component: BusinessRequirementDetailsComponent;
  let fixture: ComponentFixture<BusinessRequirementDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessRequirementDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessRequirementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
