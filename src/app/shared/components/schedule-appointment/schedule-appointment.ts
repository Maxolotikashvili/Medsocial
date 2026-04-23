import { ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { AvailabilityDates } from '../../../features/availability-dates/availability-dates';
import { ScrollFromBreadcrumbDirective } from '../../directives/scroll-from-breadcrumb.directive';
import { CalendarEvent } from 'calendar-utils';
import { ModalService } from '../../../core/services/modal.service';
import { RequestAppointmentModal } from '../modals/request-appointment-modal/request-appointment-modal';
import { ActivatedRoute } from '@angular/router';
import { ProceduresService } from '../../../core/services/procedures.service';
import { Procedure } from '../../../core/models/procedures.model';
import { Loading } from '../../../features/loading/loading';
import { DoctorWorkingHoursPayload } from '../../../core/models/schedule.model';
import { switchMap, take, tap } from 'rxjs';
import { ScheduleService } from '../../../core/services/schedule.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../../core/services/error.service';

@Component({
  selector: 'schedule-appointment',
  imports: [AvailabilityDates, ScrollFromBreadcrumbDirective, Loading],
  templateUrl: './schedule-appointment.html',
  styleUrl: './schedule-appointment.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleAppointment implements OnInit {
  private route = inject(ActivatedRoute);
  private modalService = inject(ModalService);
  private proceduresService = inject(ProceduresService);
  private scheduleService = inject(ScheduleService);
  private errorService = inject(ErrorService);

  private procedure: WritableSignal<Procedure | null> = signal(null);
  public isLoading = signal(false);

  public availabilityList = signal<CalendarEvent[]>([]);

  private readonly MEETING_TIME = 60;

  ngOnInit(): void {
    this.getRouteId();
  }

  private getRouteId() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.loadData(id);
  }

  private loadData(id: string): void {
    const today = new Date();
    const monthFromToday = new Date();
    monthFromToday.setMonth(today.getMonth() + 1);

    const payload: DoctorWorkingHoursPayload = {
      start_date: today.toISOString().split('T')[0],
      end_date: monthFromToday.toISOString().split('T')[0],
    };

    this.isLoading.set(true);

    this.proceduresService
      .getProcedure(id)
      .pipe(
        tap((p) => this.procedure.set(p)),
        switchMap((p) => this.scheduleService.getDoctorWorkingHours(p.user.id, payload)),
        take(1),
      )
      .subscribe({
        next: (response) => {
          const events: CalendarEvent[] = [];

          Object.entries(response.schedules).forEach(([date, slots]) => {
            if (!slots.length) {
              events.push({
                id: `blocked-${date}`,
                start: new Date(date),
                end: new Date(date),
                allDay: true,
                title: 'Not available',
                meta: { availability: 'closed' },
                cssClass: 'slot-blocked',
              });
              return;
            }

            slots.forEach(([startISO, endISO], i) => {
              const start = new Date(startISO);
              const end = new Date(endISO);

              const splitSlots = this.splitIntoSlots(start, end, this.MEETING_TIME);

              splitSlots.forEach((slot, index) => {
                events.push({
                  id: `${date}-${i}-${index}`,
                  start: slot.start,
                  end: slot.end,
                  title: 'Available',
                  meta: {
                    availability: 'open',
                  },
                });
              });
            });
          });

          this.availabilityList.set(events);
          this.isLoading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.errorService.handleError(error);
          this.isLoading.set(false);
        },
      });
  }

  private splitIntoSlots(start: Date, end: Date, durationMinutes: number): { start: Date; end: Date }[] {
    const slots: { start: Date; end: Date }[] = [];
    let current = new Date(start);

    while (current < end) {
      const next = new Date(current);
      next.setMinutes(next.getMinutes() + durationMinutes);

      if (next <= end) {
        slots.push({
          start: new Date(current),
          end: new Date(next),
        });
      }

      current = next;
    }

    return slots;
  }

  public openRequestAppointmentModal(event: CalendarEvent) {
    this.modalService.open(RequestAppointmentModal, {
      modalData: { procedure: this.procedure(), date: event },
    });
  }
}
