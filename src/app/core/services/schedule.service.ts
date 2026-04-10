import { inject, Injectable } from '@angular/core';
import { WorkSchedule, WorkSchedulePayload } from '../models/schedule.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../tokens/api-injection-token';
import { API_ENDPOINTS } from '../configs/api-endpoints.config';
import { UserService } from './user.service';
import { PaginatedResponse } from '../models/procedures.model';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);
  private userService = inject(UserService);

  constructor() {}

  public getWorkingSchedule(): Observable<PaginatedResponse<WorkSchedule>> {
    const userId = this.userService.user().id;
    return this.http.get<PaginatedResponse<WorkSchedule>>(`${this.apiUrl}/${API_ENDPOINTS.USERS.SCHEDULES(userId)}`);
  }

  public updateWorkSchedule(payload: WorkSchedulePayload): Observable<WorkSchedule> {
    const userId = this.userService.user().id;
    return this.http.post<WorkSchedule>(`${this.apiUrl}/${API_ENDPOINTS.USERS.SCHEDULES(userId)}`, payload);
  }
}
