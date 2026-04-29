import { Component, ChangeDetectionStrategy, input, ViewEncapsulation, InputSignal, OnInit, ViewChild } from '@angular/core';
import { startOfDay, endOfDay, isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import { provideCalendar, CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView, CalendarPreviousViewDirective, CalendarTodayDirective, CalendarNextViewDirective, CalendarMonthViewComponent, CalendarWeekViewComponent, CalendarDayViewComponent, CalendarDatePipe, DateAdapter } from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { FormsModule } from '@angular/forms';
import { provideFlatpickrDefaults } from 'angularx-flatpickr';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ButtonModule } from 'primeng/button';
import { Popover, PopoverModule } from 'primeng/popover';

@Component({
  selector: 'calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
  imports: [CalendarPreviousViewDirective, CalendarTodayDirective, CalendarNextViewDirective, CalendarMonthViewComponent, CalendarWeekViewComponent, CalendarDayViewComponent, FormsModule, CalendarDatePipe, ButtonModule, PopoverModule],
  providers: [
    provideFlatpickrDefaults(),
    provideCalendar({ provide: DateAdapter, useFactory: adapterFactory }),
  ],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit {
  @ViewChild('op') op!: Popover;

  public displayControls = input<boolean>(true);
  public eventsList: InputSignal<CalendarEvent[]> = input<CalendarEvent[]>([]);
  public initialView = input<'Day' | 'Week' | 'Month'>('Month');

  public view: CalendarView = CalendarView['Month'];
  public readonly CalendarView = CalendarView;
  public viewDate: Date = new Date();
  public refresh = new Subject<void>();
  public activeDayIsOpen: boolean = true;

  private colors: Record<string, EventColor> = {
    red: {
      primary: 'var(--danger)',
      secondary: 'var(--color-white-0)',
    },
    
    green: {
      primary: 'var(--success)',
      secondary: 'var(--surface-0)',
    },

    blue: {
      primary: 'var(--blue-700)',
      secondary: 'var(--surface-0)',
    },

    yellow: {
      primary: 'var(--warning)',
      secondary: 'var(--surface-0)',
    }
  };  

  public readonly actions: CalendarEventAction[] = [
    {
      label: 'Edit',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        // this.handleEvent('Edited', event);
      },
    },
    {
      label: 'Delete',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        // this.handleEvent('Deleted', event);
      },
    },
  ];

  public events: CalendarEvent[] = [];

  constructor() {}

  ngOnInit(): void {
    this.assignInputParams();
    this.assignEventsToEventsList();
  }

  private assignEventsToEventsList() {
    this.events = this.eventsList().map((event) => {
      if (event.meta.importance === 1) {
        return {
          ...event,
          color: { ...this.colors['red'] }
        }
      }

      if (event.meta.importance === 2) {
        return {
          ...event,
          color: { ...this.colors['green'] }
        }
      }

      if (event.meta.importance === 1) {
        return {
          ...event,
          color: { ...this.colors['blue'] }
        }
      }
      console.log({...this.colors['red']})
      return event;
    })
  }

  private assignInputParams() {
    this.view = CalendarView[this.initialView()];
  }

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
  }

  public handleEvent(calendarEvent: CalendarEvent, event: MouseEvent | KeyboardEvent): void {
    const meetingLink = calendarEvent.meta.meetingLink;

    this.op.toggle(event);
  }

  public addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: this.colors['red'],
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  public deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  public setView(view: CalendarView) {
    this.view = view;
  }

  public closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
