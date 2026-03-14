import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../tokens/injection-token';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  TokenRefreshResponse,
  TokenVerifyResponse,
} from '../models/auth.model';
import { Observable, pipe, switchMap, take, tap } from 'rxjs';
import { StorageService } from './storage.service';
import { DecodedTokenType, User } from '../models/user.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class Authservice {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private storageService = inject(StorageService);
  private userService = inject(UserService);

  constructor() {}

  public register(userData: RegisterRequest): Observable<RegisterRequest> {
    userData.role = 2;
    return this.http.post<RegisterRequest>(`${this.apiUrl}/auth/register/`, userData);
  }

  public login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/token/`, credentials).pipe(
      tap((res: LoginResponse) => {
        this.storageService.set('access_token', res.access);
        this.storageService.set('refresh_token', res.refresh);
      })
    );
  }

  public refreshToken(refresh: string): Observable<TokenRefreshResponse> {
    return this.http.post<TokenRefreshResponse>(`${this.apiUrl}/auth/token/refresh/`, refresh);
  }

  public verifyToken(token: string): Observable<TokenVerifyResponse> {
    return this.http.post<TokenVerifyResponse>(`${this.apiUrl}/auth/token/verify`, token);
  }
}
