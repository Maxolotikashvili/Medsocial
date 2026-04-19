import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleAppointment } from './schedule-appointment';

describe('ScheduleAppointment', () => {
  let component: ScheduleAppointment;
  let fixture: ComponentFixture<ScheduleAppointment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleAppointment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleAppointment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
