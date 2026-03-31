import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/procedures.model';
import { Doctor } from '../../core/models/doctor.model';
import { API_URL } from '../tokens/api-injection-token';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../configs/api-endpoints.config';
import { Review, ReviewResponse } from '../models/rating.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private api_url: string = inject(API_URL);

  constructor() {}

  public getDoctors(): Observable<PaginatedResponse<Doctor>> {
    return this.http.get<PaginatedResponse<Doctor>>(`${this.api_url}/${API_ENDPOINTS.DOCTORS.DOCTORS}`);
  }

  public getDoctor(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.api_url}/${API_ENDPOINTS.DOCTORS.DOCTOR(id)}`);
  }

  public getDoctorReviews(id: string): Observable<PaginatedResponse<ReviewResponse>> {
    return this.http.get<PaginatedResponse<ReviewResponse>>(`${this.api_url}/${API_ENDPOINTS.DOCTORS.DOCTORS_REVIEWS(id)}`);
  }

  public changeDoctorsReview(id: string, review: Review): Observable<ReviewResponse> {
    return this.http.post<ReviewResponse>(`${this.api_url}/${API_ENDPOINTS.DOCTORS.DOCTORS_REVIEW(id)}`, review);
  }
}
