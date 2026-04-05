import { Routes } from '@angular/router';
import { Dashboard } from './shared/components/dashboard/dashboard';
import { authGuard } from './core/guards/auth.guard';
import { Procedures } from './shared/components/procedures/procedures';
import { ProcedureDetails } from './shared/components/procedure-details/procedure-details';
import { Doctor } from './shared/components/doctor/doctor';
import { Doctors } from './shared/components/doctors/doctors';
import { Home } from './shared/components/home/home';
import { doctorGuard } from './core/guards/doctor.guard';

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
        loadComponent: () => import('./shared/components/dashboard/profile/profile').then((m) => m.Profile)
      },

      {
        path: 'appointments',
        loadComponent: () => import('./shared/components/dashboard/appointments/appointments').then((m) => m.Appointments)
      },

      {
        path: 'meeting-history',
        loadComponent: () => import('./shared/components/dashboard/meeting-history/meeting-history').then((m) => m.MeetingHistory)
      },

      {
        path: 'professional-info',
        loadComponent: () => import('./shared/components/dashboard/professional-info/professional-info').then((m) => m.ProfessionalInfo),
        canActivate: [doctorGuard]
      },

      {
        path: 'upcoming-meetings',
        loadComponent: () => import('./shared/components/dashboard/upcoming-meetings/upcoming-meetings').then((m) => m.UpcomingMeetings)
      },

      {
        path: 'requested-meetings',
        loadComponent: () => import('./shared/components/dashboard/requested-meetings/requested-meetings').then((m) => m.RequestedMeetings)
      },

      {
        path: 'appointments',
        loadComponent: () => import('./shared/components/dashboard/appointments/appointments').then((m) => m.Appointments)
      },
    ],
  },
];
