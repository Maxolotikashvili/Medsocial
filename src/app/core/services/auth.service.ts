import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { API_URL } from '../tokens/injection-token';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  TokenRefreshResponse,
  TokenVerifyResponse,
} from '../models/auth.model';
import { EMPTY, Observable, switchMap, tap, timer } from 'rxjs';
import { StorageService } from './storage.service';
import { AUTH_CONFIG } from '../configs/auth.config';
import { DecodedTokenType, User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class Authservice {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private storageService = inject(StorageService);

  private accessTokenSignal: WritableSignal<string | null> = signal(this.storageService.get<string | null>(AUTH_CONFIG.STORAGE_KEYS.ACCESS_TOKEN));
  public access_token = this.accessTokenSignal.asReadonly();
  private refreshTokenSignal: WritableSignal<string | null> = signal(this.storageService.get<string | null>(AUTH_CONFIG.STORAGE_KEYS.REFRESH_TOKEN));
  public refresh_token = this.refreshTokenSignal.asReadonly();

  public isLoggedIn: Signal<boolean> = computed(() => !!this.accessTokenSignal());
  private currentUserSignal = signal<User>({} as User);
  public user = this.currentUserSignal.asReadonly();

  constructor() {}

  public register(userData: RegisterRequest): Observable<RegisterRequest> {
    userData.role = 2;
    return this.http.post<RegisterRequest>(`${this.apiUrl}/auth/register/`, userData);
  }

  public login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/token/`, credentials).pipe(
      tap((res: LoginResponse) => {
        this.storageService.set(AUTH_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, res.access);
        this.storageService.set(AUTH_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, res.refresh);

        this.accessTokenSignal.set(res.access);
        this.refreshTokenSignal.set(res.refresh);

        this.scheduleTokenRefresh();
        location.reload();
      }),
    );
  }

  public scheduleTokenRefresh() {
    const token = this.access_token();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      const timeUntilRefresh = expiry - Date.now() - AUTH_CONFIG.REFRESH_BUFFER_MS;

      if (timeUntilRefresh <= 0) {
        this.refreshToken().subscribe({
          next: () => this.scheduleTokenRefresh(),
          error: () => this.logOut(),
        });
      } else {
        timer(timeUntilRefresh).pipe(switchMap(() => this.refreshToken())).subscribe({
            next: () => this.scheduleTokenRefresh(),
            error: () => this.logOut(),
          });
      }
    } catch {
      this.logOut();
    }
  }

  public refreshToken(): Observable<TokenRefreshResponse> {
    const refresh = this.refreshTokenSignal();

    if (!refresh) {
      this.logOut();
      throw new Error('No refresh token');
    }

    return this.http.post<TokenRefreshResponse>(`${this.apiUrl}/auth/token/refresh/`, { refresh }).pipe(
      tap((res) => {
        this.storageService.set(AUTH_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, res.access);
        this.accessTokenSignal.set(res.access);
      }),
    );
  }

  private verifyToken(): Observable<TokenVerifyResponse> {
    return this.http.post<TokenVerifyResponse>(`${this.apiUrl}/auth/token/verify`, {
      token: this.access_token(),
    });
  }

  public logOut() {
    this.storageService.remove(AUTH_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    this.storageService.remove(AUTH_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
    this.accessTokenSignal.set(null);

    location.reload();
  }

  public refreshUser(): Observable<User> {
    const access_token = this.access_token();
    if (!access_token) return EMPTY;

    const payload = this.decodeToken(access_token);
    const id = payload?.user_id;

    return this.http.get<User>(`${this.apiUrl}/users/${id}/`).pipe(tap((user) => this.currentUserSignal.set(user)));
  }

  private decodeToken(token: string): DecodedTokenType | null {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }
}
