import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PaginatedResponse, Procedure, ProceduresQueryParams } from '../models/procedures.model';
import { API_URL } from '../tokens/api-injection-token';
import { API_ENDPOINTS } from '../configs/api-endpoints.config';
import { Filter } from '../models/filter.model';

@Injectable({
  providedIn: 'root',
})
export class ProceduresService {
  private http = inject(HttpClient);
  private apiUrl: string = inject(API_URL);

  constructor() {}

  public getProceduresList(parameters?: ProceduresQueryParams): Observable<PaginatedResponse<Procedure>> {
    let params = new HttpParams();

    if (parameters) {
      params = this.setQueryParams(parameters);
    }
    return this.http.get<PaginatedResponse<Procedure>>(`${this.apiUrl}/${API_ENDPOINTS.DOCTORS.PROCEDURES}`, { params }).pipe(
      map((data) => {
        return { ...data, totalPages: this.getTotalPages(data) };
      }),
    );
  }

  private setQueryParams(parameters: ProceduresQueryParams): HttpParams {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(parameters)) {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          params = params.append(key, v);
        });
      } else {
        params = params.set(key, value as string);
      }
    }

    return params;
  }

  public getHospitals(procedures: Procedure[]): Procedure['hospital'][] {
    return procedures.map((procedure) => procedure.hospital);
  }

  public getCategories(procedures: Procedure[]) {
    return procedures.map((procedure) => procedure.category.title);
  }

  public mapProceduresQueryParams(target: Partial<Filter> | {search: string}): ProceduresQueryParams {
    const acc: any = {};
    const searchTerms: string[] = [];

    for (const [key, obj] of Object.entries(target)) {
      let valueStr;
      
      if ('search' in target) {
        valueStr = obj.toString().trim();
      } else {
        valueStr = obj.value.toString().trim();
      }
      if (!valueStr) continue;

      if (key === 'Department') {
        acc['category_title'] = valueStr;
      } else if (key === 'City') {
        acc['city'] = obj.id;
      } else if (key === 'Country') {
        acc['country'] = obj.id;
      } else {
        searchTerms.push(valueStr);
      }
    }

    if (searchTerms.length > 0) {
      acc['q'] = searchTerms;
    }
    return acc as ProceduresQueryParams;
  }

  private getTotalPages(data: PaginatedResponse<Procedure>): number {
    return Math.ceil(data.count / (data.results.length || 1));
  }

  public getProcedureDetails(id: string): Observable<Procedure> {
    return this.http.get<Procedure>(`${this.apiUrl}/${API_ENDPOINTS.DOCTORS.PROCEDURE(id)}`);
  }
}
