import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProceduresList } from '../models/procedures';
import { API_URL } from '../tokens/injection-token';

@Injectable({
  providedIn: 'root',
})
export class Procedures {
  private http = inject(HttpClient);
  private apiUrl: string = inject(API_URL);

  constructor() {}

  public getAllProceduresList(): Observable<ProceduresList> {
    return this.http.get<ProceduresList>(`${this.apiUrl}/doctors/procedures/`);
  }
}
