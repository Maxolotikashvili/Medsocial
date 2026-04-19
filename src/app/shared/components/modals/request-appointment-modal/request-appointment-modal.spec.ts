import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAppointmentModal } from './request-appointment-modal';

describe('RequestAppointmentModal', () => {
  let component: RequestAppointmentModal;
  let fixture: ComponentFixture<RequestAppointmentModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestAppointmentModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestAppointmentModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
