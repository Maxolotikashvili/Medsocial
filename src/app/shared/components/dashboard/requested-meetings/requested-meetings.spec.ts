import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedMeetings } from './requested-meetings';

describe('RequestedMeetings', () => {
  let component: RequestedMeetings;
  let fixture: ComponentFixture<RequestedMeetings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestedMeetings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestedMeetings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
