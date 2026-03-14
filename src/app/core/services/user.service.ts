import { inject, Injectable, signal } from '@angular/core';
import { DecodedTokenType, User } from '../models/user.model';
import { API_URL } from '../tokens/injection-token';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl: string = inject(API_URL);
  private http = inject(HttpClient);

  public currentUser = signal<User | null>(null);

  constructor() {}

  public getUser(token: string): Observable<User> {
    const payload = this.decodeToken(token);
    const id = payload?.user_id;

    return this.http.get<User>(`${this.apiUrl}/users/${id}/`).pipe(tap(user => this.currentUser.set(user)));
  }

  private decodeToken(token: string): DecodedTokenType | null {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }
}
