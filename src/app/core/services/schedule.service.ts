import { inject, Injectable } from '@angular/core';
import { AppointmentPayload, Consultation, DoctorWorkingHoursPayload, DoctorWorkingHoursResponse, WorkSchedule, WorkSchedulePayload } from '../models/schedule.model';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../tokens/api-injection-token';
import { API_ENDPOINTS } from '../configs/api-endpoints.config';
import { UserService } from './user.service';
import { PaginatedResponse } from '../models/procedures.model';
import { USER_ROLES } from '../configs/user.config';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);
  private userService = inject(UserService);

  constructor() {}

  public getWorkingSchedule(doctorId: string): Observable<PaginatedResponse<WorkSchedule>> {
    return this.http.get<PaginatedResponse<WorkSchedule>>(`${this.apiUrl}/${API_ENDPOINTS.USERS.SCHEDULES.get(doctorId)}`);
  }

  public addWorkSchedule(payload: WorkSchedulePayload): Observable<WorkSchedule> {
    const userId = this.userService.user().id;
    return this.http.post<WorkSchedule>(`${this.apiUrl}/${API_ENDPOINTS.USERS.SCHEDULES.post(userId)}`, payload);
  }

  public updateWorkSchedule(payload: { doctorId: string, wh_id: string, body: WorkSchedule}): Observable<WorkSchedule> {
    return this.http.patch<WorkSchedule>(`${this.apiUrl}/${API_ENDPOINTS.USERS.SCHEDULES.patch(payload.doctorId, payload.wh_id)}`, payload.body);
  }

  public deleteWorkSchedule(doctorId: string, wh_id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${API_ENDPOINTS.USERS.SCHEDULES.delete(doctorId, wh_id)}`);
  }

  public scheduleAppointmentWithDoctor(doctorId: string, payload: AppointmentPayload | FormData): Observable<AppointmentPayload> {
    return this.http.post<AppointmentPayload>(`${this.apiUrl}/${API_ENDPOINTS.DOCTORS.DOCTORS_APPOINTMENT(doctorId)}`, payload);
  }

  public getDoctorWorkingHours(doctorId: string, payload: DoctorWorkingHoursPayload): Observable<DoctorWorkingHoursResponse> {
    return this.http.post<DoctorWorkingHoursResponse>(`${this.apiUrl}/${API_ENDPOINTS.DOCTORS.WORKING_HOURS(doctorId)}`, payload);
  }

  public getConsultations(): Observable<PaginatedResponse<Consultation>> {
    const userId = this.userService.user().id;

    return this.http.get<PaginatedResponse<Consultation>>(`${this.apiUrl}/${API_ENDPOINTS.USERS.CONSULTATIONS(userId)}`);
  }

  public getConsultation(consultationId: string): Observable<Consultation> {
    const userId = this.userService.user().id;

    return this.http.get<Consultation>(`${this.apiUrl}/${API_ENDPOINTS.USERS.CONSULTATION(userId, consultationId)}`);
  }

  public updateConsultation(consultationId: string, status: 1 | 2 | 3): Observable<{status: 1 | 2 | 3}> {
    const user = this.userService.user();

    if (user.role !== USER_ROLES.DOCTOR) return EMPTY;
    return this.http.patch<{status: 1 | 2 | 3}>(`${this.apiUrl}/${API_ENDPOINTS.USERS.CONSULTATION(user.id, consultationId)}`, status);
  }
}
