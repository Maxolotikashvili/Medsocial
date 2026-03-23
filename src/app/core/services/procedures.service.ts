import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProceduresList, ProceduresQueryParams } from '../models/procedures.model';
import { API_URL } from '../tokens/injection-token';
import { API_ENDPOINTS } from '../configs/api-endpoints.config';

@Injectable({
  providedIn: 'root',
})
export class ProceduresService {
  private http = inject(HttpClient);
  private apiUrl: string = inject(API_URL);

  constructor() {}

  public getProceduresList(parameters?: ProceduresQueryParams): Observable<ProceduresList> {
    let params = new HttpParams({
      fromObject: parameters as Record<string, any>,
    });

    return this.http.get<ProceduresList>(`${this.apiUrl}/${API_ENDPOINTS.DOCTORS.PROCEDURES}`, {
      params,
    });
  }
}
