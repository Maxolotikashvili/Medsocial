import { CalendarEvent } from 'calendar-utils';
import { WorkSchedule } from './schedule.model';

export type CalendarView = 'Day' | 'Week' | 'Month';

export interface CalendarEventInternal {
  start: Date;
  end?: Date;
  title: string;
  allDay?: boolean;
}

export type CalendarEventParams = Omit<CalendarEvent, 'start' | 'end' | 'title'>;