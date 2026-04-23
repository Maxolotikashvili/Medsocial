import { DashboardNavLink } from '../models/navigation.model';
import { USER_ROLES } from './user.config';

export const DASHBOARD_SIDEBAR_ROUTES: DashboardNavLink[] = [
  { name: 'Profile', route: '/dashboard/profile', role: [USER_ROLES.DOCTOR, USER_ROLES.PATIENT] },
  { name: 'Professional Info', route: '/dashboard/professional-info', role: [USER_ROLES.DOCTOR]},
  { name: 'Appointments', route: '/dashboard/appointments', role: [USER_ROLES.DOCTOR, USER_ROLES.PATIENT] },
  { name: 'Notifications', route: '/dashboard/notifications', role: [USER_ROLES.DOCTOR, USER_ROLES.PATIENT] },
  { name: 'Work Schedule', route: '/dashboard/work-schedule', role: [USER_ROLES.DOCTOR] },
  { name: 'Procedures', route: '/dashboard/doctors-procedures', role: [USER_ROLES.DOCTOR] }
] as const;
