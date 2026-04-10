import { WEEK_DAYS } from '../configs/schedule.config';

export interface Appointment {
  id: string;
  date: Date;
  brief: string;
  image: string;
  procedure_id: string;
}

export type AppointmentPayload = Omit<Appointment, 'id' | 'image'> & {
  image?: string;
};

export interface WorkSchedule {
  id: string;
  week_day: WeekDayKey;
  start_time: string;
  end_time: string;
}

export interface WorkScheduleForm {
  weekDay: WeekDayKey;
  isActive: boolean;
  startTime: WorkScheduleFormTime;
  endTime: WorkScheduleFormTime;
}

export interface WorkScheduleFormTime {
  id: string | number;
  value: string;
}

export type WorkSchedulePayload = Omit<WorkSchedule, 'id'>;
export type WeekDay = (typeof WEEK_DAYS)[number];
export type WeekDayKey = WeekDay['key'];
export type WeekDayValue = WeekDay['label'];

export interface ScheduleSettings {
  interval: 1 | 0.5;
  workDays: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  format: '12h' | '24h';
}
