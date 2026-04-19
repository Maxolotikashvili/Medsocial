import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityDates } from './availability-dates';

describe('AvailabilityDates', () => {
  let component: AvailabilityDates;
  let fixture: ComponentFixture<AvailabilityDates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailabilityDates]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailabilityDates);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
