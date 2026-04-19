import { Component, effect, input, InputSignal, output, ViewEncapsulation } from '@angular/core';
import { provideFlatpickrDefaults } from 'angularx-flatpickr';
import { CalendarDatePipe, CalendarDayViewComponent, CalendarEvent, CalendarEventTimesChangedEvent, CalendarMonthViewComponent, CalendarMonthViewDay, CalendarTodayDirective, CalendarView, CalendarWeekViewComponent, DateAdapter, provideCalendar, CalendarNextViewDirective, CalendarPreviousViewDirective } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FormsModule } from '@angular/forms';
import { EventColor } from 'calendar-utils';
import { Subject } from 'rxjs';
import { addMonths, isAfter, isBefore, isSameDay, startOfDay } from 'date-fns';
import { DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'availability-dates',
  imports: [TitleCasePipe, DatePipe, CalendarMonthViewComponent, CalendarWeekViewComponent, CalendarDayViewComponent, FormsModule, CalendarDatePipe, CalendarTodayDirective, CalendarNextViewDirective, CalendarPreviousViewDirective ],
  providers: [
    provideFlatpickrDefaults(),
    provideCalendar({ provide: DateAdapter, useFactory: adapterFactory }),
  ],
  templateUrl: './availability-dates.html',
  styleUrl: './availability-dates.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AvailabilityDates {
  public eventsInput: InputSignal<CalendarEvent[]> = input<CalendarEvent[]>([]);
  public availableDateClicked = output<CalendarEvent>();

  public view: CalendarView = CalendarView['Month'];
  public viewDate: Date = new Date();
  public events: CalendarEvent[] = [];
  readonly CalendarView = CalendarView;

  public refresh = new Subject<void>();
  public activeDayIsOpen: boolean = true;

  public minMonth: Date = startOfDay(new Date());
  public maxMonth: Date = addMonths(startOfDay(new Date()), 1);

  // private colors: Record<string, EventColor> = {
  //   green: {
  //     primary: 'var(--color-green-0)',
  //     secondary: 'var(--color-green-0)',
  //     secondaryText: 'var(--color-white-0',
  //   },

  //   red: {
  //     primary: 'var(--color-red-0)',
  //     secondaryText: 'var(--color-blue-0)',
  //     secondary: 'var(--color-white-0)',
  //   },
  //   blue: {
  //     primary: 'var(--color-blue-2)',
  //     secondary: 'var(--color-white-0)',
  //   },
  //   yellow: {
  //     primary: 'var(--color-yellow-0)',
  //     secondary: 'var(--color-white-0)',
  //   },
  //   gray: {
  //     primary: 'var(--color-gray-0)',
  //     secondary: 'var(--color-gray-0)',
  //     secondaryText: 'var(--color-white-0)',
  //   },
  // };

  public hasFullDayBlock(events: CalendarEvent[]): boolean {
    return events.some((event) => event.allDay && event.meta?.availability === 'closed');
  }

  public hasAvailability(events: CalendarEvent[]): boolean {
    return events.some((event) => event.meta?.availability === 'open');
  }

  constructor() {
    effect(() => {
    this.events = this.eventsInput() || [];
    this.refresh.next();
  });
  }

  public isToday(date: Date | string): boolean {
    return isSameDay(date, new Date());
  }

  public beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    const minDate = this.minMonth;
    const maxDate = this.maxMonth;

    body.forEach((day) => {
      if (isBefore(day.date, minDate) || isAfter(day.date, maxDate)) {
        day.cssClass = 'out-of-range-cell';
      }
    });
  }

  public eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
  }

  public setView(view: CalendarView): void {
    this.view = view;
  }

  public closeOpenMonthViewDay(): void {
    this.activeDayIsOpen = false;
  }

  public dayClicked(day: CalendarMonthViewDay): void {
    const { date, events } = day;

    if (isBefore(date, this.minMonth) || isAfter(date, this.maxMonth)) return;

    const hasAvailability = events.some((event) => event.meta?.availability === 'open');
    if (!hasAvailability) return;

    this.viewDate = date;
    this.setView(CalendarView.Day);
  }

  public handleEvent(event: CalendarEvent): void {
    if (event.meta.availability === 'open' && event.title === 'Available') {
      this.availableDateClicked.emit(event);
    }
  }
}
