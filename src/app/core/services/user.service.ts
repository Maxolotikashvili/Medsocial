import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/procedures.model';
import { Doctor, Education, EducationPayload, Experience, ExperiencePayload } from '../../core/models/doctor.model';
import { API_URL } from '../tokens/api-injection-token';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../configs/api-endpoints.config';
import { Review, ReviewResponse } from '../models/rating.model';
import { ApiUser, UserInfo } from '../models/user.model';
import { USER_INITIAL_VALUE } from '../configs/user.config';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl: string = inject(API_URL);

  public currentUserSignal: WritableSignal<ApiUser> = signal<ApiUser>(USER_INITIAL_VALUE);
  public user: Signal<ApiUser> = this.currentUserSignal.asReadonly();

  constructor() {}

  public updateUser(newUser: ApiUser | UserInfo): void {
    this.currentUserSignal.set({...this.user(), ...newUser});
  }

  public getUserInfo(id: string) {
    return this.http.get<ApiUser>(`${this.apiUrl}/${API_ENDPOINTS.USERS.USER(id)}`);
  }

  public updateUserInfo(id: string, userInfo: Partial<UserInfo>): Observable<UserInfo> {
    return this.http.patch<UserInfo>(`${this.apiUrl}/${API_ENDPOINTS.USERS.USER(id)}`, userInfo);
  }

  public getDoctors(): Observable<PaginatedResponse<Doctor>> {
    return this.http.get<PaginatedResponse<Doctor>>(`${this.apiUrl}/${API_ENDPOINTS.DOCTORS.DOCTORS}`);
  }

  public getDoctor(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${API_ENDPOINTS.DOCTORS.DOCTOR(id)}`);
  }
  
  public getDoctorReviews(id: string): Observable<PaginatedResponse<ReviewResponse>> {
    return this.http.get<PaginatedResponse<ReviewResponse>>(`${this.apiUrl}/${API_ENDPOINTS.DOCTORS.DOCTORS_REVIEWS(id)}`);
  }
  
  public changeDoctorsReview(id: string, review: Review): Observable<ReviewResponse> {
    return this.http.post<ReviewResponse>(`${this.apiUrl}/${API_ENDPOINTS.DOCTORS.DOCTORS_REVIEW(id)}`, review);
  }

  public updateEducation(payload: {userId: ApiUser['id'], educationId: Education['id'], body: Partial<EducationPayload>}): Observable<Education> {
    const userId = payload.userId;
    const educationId = payload.educationId;
    const body = payload.body;
    
    return this.http.patch<Education>(`${this.apiUrl}/${API_ENDPOINTS.USERS.EDUCATION.update(userId, educationId)}`, body);
  }

  public addNewEducation(payload: {userId: ApiUser['id'], body: EducationPayload}) {
    const userId = payload.userId;
    const body = payload.body;
    return this.http.post<Education>(`${this.apiUrl}/${API_ENDPOINTS.USERS.EDUCATION.create(userId)}`, body)
  }

  public updateExperience(payload: {userId: ApiUser['id'], experienceId: Experience['id'], body: Partial<ExperiencePayload>}): Observable<Experience> {
    const userId= payload.userId;
    const educationId = payload.experienceId;
    const body = payload.body;

    return this.http.patch<Experience>(`${this.apiUrl}/${API_ENDPOINTS.USERS.EXPERIENCE.update(userId, educationId)}`, body);
  }

  public addNewExperience(payload: {userId: ApiUser['id'], body: ExperiencePayload}): Observable<Experience> {
    const userId = payload.userId;
    const body = payload.body;

    return this.http.post<Experience>(`${this.apiUrl}/${API_ENDPOINTS.USERS.EXPERIENCE.create(userId)}`, body);
  }

}
