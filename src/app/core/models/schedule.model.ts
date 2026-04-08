import { WEEK_DAYS } from "../configs/schedule.config";

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
  start_time: Date;
  end_time: Date
}

export type WeekDay = typeof WEEK_DAYS[number];
export type WeekDayKey = WeekDay['key'];
export type WeekDayValue = WeekDay['label'];