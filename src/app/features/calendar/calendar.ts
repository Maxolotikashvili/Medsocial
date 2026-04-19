import { Component, ChangeDetectionStrategy, ViewEncapsulation, input, InputSignal, OnInit } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, addMonths, isAfter, isBefore } from 'date-fns';
import { Subject } from 'rxjs';
import { provideCalendar, CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView, CalendarPreviousViewDirective, CalendarTodayDirective, CalendarNextViewDirective, CalendarMonthViewComponent, CalendarWeekViewComponent, CalendarDayViewComponent, CalendarDatePipe, DateAdapter } from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { FormsModule } from '@angular/forms';
import { provideFlatpickrDefaults } from 'angularx-flatpickr';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarEventInternal, CalendarEventParams } from '../../core/models/calendar.model';

@Component({
  selector: 'calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'calendar.html',
  imports: [
    // CalendarPreviousViewDirective,
    CalendarTodayDirective,
    // CalendarNextViewDirective,
    CalendarMonthViewComponent,
    CalendarWeekViewComponent,
    CalendarDayViewComponent,
    FormsModule,
    CalendarDatePipe,
    // FaIconComponent
],
  styleUrls: ['./calendar.scss'],
  providers: [
    provideFlatpickrDefaults(),
    provideCalendar({ provide: DateAdapter, useFactory: adapterFactory }),
  ],
  encapsulation: ViewEncapsulation.None,
})
export class Calendar implements OnInit {
  
  public initialView: InputSignal<'Day' | 'Week' | 'Month'> = input<'Day' | 'Week' | 'Month'>('Week');
  public eventsList: InputSignal<CalendarEventInternal[]> = input<CalendarEventInternal[]>([]); 
  // public availableDates: InputSignal<CalendarEventInternal[]> = input<CalendarEventInternal[]>([]);

  public view: CalendarView = CalendarView[this.initialView()];
  readonly CalendarView = CalendarView;
  public viewDate: Date = new Date();
  // public currentDate = new Date();
  public events: CalendarEvent[] = [];
  // public minMonth: Date = startOfDay(new Date());
  // public maxMonth: Date = addMonths(startOfDay(new Date()), 1);

  private actions: CalendarEventAction[] = [
    {
      label: '<fa-icon [icon]="icons.edit"></fa-icon>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: 'maxo',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  private colors: Record<string, EventColor> = {
    red: {
      primary: 'var(--color-red-0)',
      secondaryText: 'var(--color-blue-0)',
      secondary: 'var(--color-white-0)',
    },
    blue: {
      primary: 'var(--color-blue-2)',
      secondary: 'var(--color-white-0)',
    },
    yellow: {
      primary: 'var(--color-yellow-0)',
      secondary: 'var(--color-white-0)',
    },
    gray: {
      primary: 'var(--color-gray-0)',
      secondary: 'var(--color-gray-0)',
      secondaryText: 'var(--color-white-0)'
    }
  };

  public refresh = new Subject<void>();
  public activeDayIsOpen: boolean = true;

  constructor() {}

  ngOnInit(): void {
    this.initializeEvents();
    // this.initializeAvailabilityDates();
  }

  private initializeEvents() {
    const eventParams: CalendarEventParams = {
      actions: this.actions,
    }

    this.events = this.eventsList().map((inputEvent: CalendarEventInternal) => {
      return {
        ...inputEvent,
        ...eventParams
      }
    })
  }

  // private initializeAvailabilityDates() {
  //   if (this.availableDates().length > 0) {
  //     this.events = this.availableDates().map((date) => {
  //       return {
  //         ...date,
  //         meta: {
  //           type: 'availability',
  //           status: date.title === 'Available' ? 'open' : 'closed'
  //         },
  //         color: {...this.colors['gray']},
  //         cssClass: 'not-available'
  //       }
  //     });
  //   }
  // }

  public dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
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
    this.handleEvent('Dropped or resized', event);
  }

  public handleEvent(action: string, event: CalendarEvent): void {
    // this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
  }

  // public addEvent(): void {
  //   this.events = [
  //     ...this.events,
  //     {
  //       title: 'New event',
  //       start: startOfDay(new Date()),
  //       end: endOfDay(new Date()),
  //       color: this.colors['blue'],
  //     },
  //   ];
  // }

  public deleteEvent(eventToDelete: CalendarEvent): void {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  public setView(view: CalendarView): void {
    this.view = view;
  }

  public closeOpenMonthViewDay(): void {
    this.activeDayIsOpen = false;
  }

  satesto() {
    const events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: { ...this.colors['yellow'] },
      actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: { ...this.colors['blue'] },
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: { ...this.colors['red'] },

      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },

    {
      start: new Date(2026, 3, 14, 12, 0),
      end: new Date(2026, 3, 14, 13, 0),
      title: 'My event',
      actions: this.actions,
    }
  ];
  }
}
