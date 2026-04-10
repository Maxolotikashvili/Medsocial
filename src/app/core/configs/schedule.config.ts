import { ScheduleSettings } from "../models/schedule.model";

export const WEEK_DAYS = [
  { key: 'MO', label: 'Monday' },
  { key: 'TU', label: 'Tuesday' },
  { key: 'WE', label: 'Wednesday' },
  { key: 'TH', label: 'Thursday' },
  { key: 'FR', label: 'Friday' },
  { key: 'SA', label: 'Saturday' },
  { key: 'SU', label: 'Sunday' },
] as const;

export const AVAILABILITY = {
    AVAILABLE: 'AVAILABLE',
    UNAVAILABLE: 'UNAVAILABLE'
} as const;

export const SCHEDULE_SETTINGS: ScheduleSettings = {
  interval: 1,
  workDays: 7,
  format: "12h"
};