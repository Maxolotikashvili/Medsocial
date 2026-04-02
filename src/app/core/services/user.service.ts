import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/procedures.model';
import { Doctor, Education } from '../../core/models/doctor.model';
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

  public updateEducation(userId: string, educationId: string, updatedEducation: Partial<Education>): Observable<Education> {
    return this.http.patch<Education>(`${this.apiUrl}/${API_ENDPOINTS.USERS.EDUCATION(userId, educationId)}`, updatedEducation);
  }

  public addNewEducation(userId: string) {
    
  }

  public updateExperience() {

  }

  public addNewExperience() {

  }

}
