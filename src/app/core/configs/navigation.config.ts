import { DashboardNavLink } from '../models/navigation.model';
import { USER_ROLES } from './user.config';

export const DASHBOARD_SIDEBAR_ROUTES: DashboardNavLink[] = [
  { name: 'Profile', route: '/dashboard/profile', role: [USER_ROLES.DOCTOR, USER_ROLES.PATIENT] },
  { name: 'Appointments', route: '/dashboard/appointments', role: [USER_ROLES.DOCTOR, USER_ROLES.PATIENT] },
  // { name: 'Transaction History', route: '/dashboard/transaction-history', role: [USER_ROLES.DOCTOR, USER_ROLES.PATIENT]},
  { name: 'Meeting History', route: '/dashboard/meeting-history', role: [USER_ROLES.DOCTOR, USER_ROLES.PATIENT]},
  { name: 'Upcoming Meetings', route: '/dashboard/upcoming-meetings', role: [USER_ROLES.DOCTOR, USER_ROLES.PATIENT] },
  { name: 'Requested Meetings', route: '/dashboard/requested-meetings', role: [USER_ROLES.DOCTOR] }
];
