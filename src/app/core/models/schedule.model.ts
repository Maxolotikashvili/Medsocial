import { WEEK_DAYS } from '../configs/schedule.config';

export interface AppointmentPayload {
  date: string;
  brief: string;
  image: File;
  procedure_id: string;
}

export interface WorkSchedule {
  id?: string;
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

export type ISO8601UTC = string;

export interface DoctorWorkingHoursResponse {
  schedules: {
    [date: string]: [ISO8601UTC, ISO8601UTC][];
  };
}

export interface DoctorWorkingHoursPayload {
  start_date: string;
  end_date: string;
}