import { Routes } from '@angular/router';
import { Home } from './shared/home/home';
import { Dashboard } from './shared/dashboard/dashboard';
import { authGuard } from './core/guards/auth.guard';
import { Procedures } from './shared/procedures/procedures';
import { ProcedureDetails } from './shared/procedure-details/procedure-details';
import { Doctor } from './shared/doctor/doctor';
import { Doctors } from './shared/doctors/doctors';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'procedures', component: Procedures, canActivate: [authGuard] },
  { path: 'procedure-details/:id', component: ProcedureDetails , canActivate: [authGuard]},
  { path: 'doctors', component: Doctors },
  { path: 'doctor/:id', component: Doctor },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
    children: [
      {
        path: 'profile',
        loadComponent: () => import('./shared/dashboard/profile/profile').then((m) => m.Profile)
      },

      {
        path: 'appointments',
        loadComponent: () => import('./shared/dashboard/appointments/appointments').then((m) => m.Appointments)
      },

      {
        path: 'meeting-history',
        loadComponent: () => import('./shared/dashboard/meeting-history/meeting-history').then((m) => m.MeetingHistory)
      },

      {
        path: 'upcoming-meetings',
        loadComponent: () => import('./shared/dashboard/upcoming-meetings/upcoming-meetings').then((m) => m.UpcomingMeetings)
      },

      {
        path: 'requested-meetings',
        loadComponent: () => import('./shared/dashboard/requested-meetings/requested-meetings').then((m) => m.RequestedMeetings)
      },

      {
        path: 'appointments',
        loadComponent: () => import('./shared/dashboard/appointments/appointments').then((m) => m.Appointments)
      },
    ],
  },
];
