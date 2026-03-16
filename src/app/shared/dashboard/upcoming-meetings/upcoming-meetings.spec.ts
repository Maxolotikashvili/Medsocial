import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingMeetings } from './upcoming-meetings';

describe('UpcomingMeetings', () => {
  let component: UpcomingMeetings;
  let fixture: ComponentFixture<UpcomingMeetings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpcomingMeetings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpcomingMeetings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
