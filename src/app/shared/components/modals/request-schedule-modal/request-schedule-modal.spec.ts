import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestScheduleModal } from './request-schedule-modal';

describe('RequestScheduleModal', () => {
  let component: RequestScheduleModal;
  let fixture: ComponentFixture<RequestScheduleModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestScheduleModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestScheduleModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
