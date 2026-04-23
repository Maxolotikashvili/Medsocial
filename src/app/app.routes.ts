import { Routes } from '@angular/router';
import { Dashboard } from './shared/components/dashboard/dashboard';
import { authGuard } from './core/guards/auth.guard';
import { ProcedureDetails } from './shared/components/procedure-details/procedure-details';
import { Doctor } from './shared/components/doctor/doctor';
import { Doctors } from './shared/components/doctors/doctors';
import { Home } from './shared/components/home/home';
import { doctorGuard } from './core/guards/doctor.guard';
import { ScheduleAppointment } from './shared/components/schedule-appointment/schedule-appointment';
import { patientGuard } from './core/guards/patient.guard';
import { ProceduresList } from './shared/components/procedures-list/procedures-list';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'procedures-list', component: ProceduresList, canActivate: [authGuard] },
  { path: 'procedure-details/:id', component: ProcedureDetails , canActivate: [authGuard]},
  { path: 'schedule-appointment/:id', component: ScheduleAppointment, canActivate: [patientGuard] },
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
        path: 'professional-info',
        loadComponent: () => import('./shared/components/dashboard/professional-info/professional-info').then((m) => m.ProfessionalInfo),
        canActivate: [doctorGuard]
      },

      {
        path: 'appointments',
        loadComponent: () => import('./shared/components/dashboard/appointments/appointments').then((m) => m.Appointments)
      },

      {
        path: 'notifications',
        loadComponent: () => import('./shared/components/dashboard/notifications/notifications').then((m) => m.Notifications)
      },

      {
        path: 'work-schedule',
        loadComponent: () => import('./shared/components/dashboard/work-schedule/work-schedule').then((m) => m.WorkSchedule),
        canActivate: [doctorGuard]
      },

      {
        path: 'doctors-procedures',
        loadComponent: () => import('./shared/components/dashboard/doctors-procedures/doctors-procedures').then((m) => m.DoctorsProcedures),
        canActivate: [doctorGuard]
      }
    ],
  },
];
