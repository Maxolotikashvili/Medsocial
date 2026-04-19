import { inject, Injectable } from '@angular/core';
import { AppointmentPayload, DoctorWorkingHoursPayload, DoctorWorkingHoursResponse, WorkSchedule, WorkSchedulePayload } from '../models/schedule.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../tokens/api-injection-token';
import { API_ENDPOINTS } from '../configs/api-endpoints.config';
import { UserService } from './user.service';
import { PaginatedResponse } from '../models/procedures.model';
import { Timezone } from '../models/location.model';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);
  private userService = inject(UserService);

  constructor() {}

  public getWorkingSchedule(doctorId: string): Observable<PaginatedResponse<WorkSchedule>> {
    return this.http.get<PaginatedResponse<WorkSchedule>>(`${this.apiUrl}/${API_ENDPOINTS.USERS.SCHEDULES(doctorId)}`);
  }

  public updateWorkSchedule(payload: WorkSchedulePayload): Observable<WorkSchedule> {
    const userId = this.userService.user().id;
    return this.http.post<WorkSchedule>(`${this.apiUrl}/${API_ENDPOINTS.USERS.SCHEDULES(userId)}`, payload);
  }

  public scheduleAppointmentWithDoctor(payload: AppointmentPayload | FormData): Observable<AppointmentPayload> {
    const user = this.userService.user();
    return this.http.post<AppointmentPayload>(`${this.apiUrl}/${API_ENDPOINTS.DOCTORS.DOCTORS_APPOINTMENT(user.id)}`, payload);
  }

  public getDoctorWorkingHours(doctorId: string, payload: DoctorWorkingHoursPayload): Observable<DoctorWorkingHoursResponse> {
    return this.http.post<DoctorWorkingHoursResponse>(`${this.apiUrl}/${API_ENDPOINTS.DOCTORS.WORKING_HOURS(doctorId)}`, payload);
  }
}
