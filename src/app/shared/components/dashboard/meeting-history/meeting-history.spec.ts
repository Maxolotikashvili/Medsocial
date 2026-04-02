import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingHistory } from './meeting-history';

describe('MeetingHistory', () => {
  let component: MeetingHistory;
  let fixture: ComponentFixture<MeetingHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetingHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
