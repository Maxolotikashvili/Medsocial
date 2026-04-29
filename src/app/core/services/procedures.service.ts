import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HospitalsQuery, PaginatedResponse, Procedure, ProcedureHospital, ProcedurePayload, ProcedureResponse, ProceduresQueryParams } from '../models/procedures.model';
import { API_URL } from '../tokens/api-injection-token';
import { API_ENDPOINTS } from '../configs/api-endpoints.config';
import { Filter } from '../models/filter.model';
import { UserService } from './user.service';
import { getTotalPages } from '../../shared/utilities/get-total-page-size-utility';

@Injectable({
  providedIn: 'root',
})
export class ProceduresService {
  private http = inject(HttpClient);
  private apiUrl: string = inject(API_URL);
  private userService = inject(UserService);

  constructor() {}

  public getProceduresList(parameters?: ProceduresQueryParams): Observable<PaginatedResponse<Procedure>> {
    let params = new HttpParams();

    if (parameters) {
      params = this.setQueryParams(parameters);
    }
    return this.http.get<PaginatedResponse<Procedure>>(`${this.apiUrl}/${API_ENDPOINTS.DOCTORS.PROCEDURES}`, { params }).pipe(
      map((data) => {
        return { ...data, totalPages: getTotalPages({count: data.count, next: data.next, previous: data.previous}) };
      }),
    );
  }

  public getProcedure(procedureId: string): Observable<Procedure> {
    return this.http.get<Procedure>(`${this.apiUrl}/${API_ENDPOINTS.DOCTORS.PROCEDURE(procedureId)}`);
  }

  public createProcedure(payload: ProcedurePayload): Observable<ProcedureResponse> {
    const user = this.userService.user();
    const formData = new FormData();
    const body = payload;

    const fileFields = ['image', 'image_after', 'video'];

    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined && value !== null && !fileFields.includes(key)) {
        formData.append(key, value.toString());
      }
    });

    if (body.image) formData.append('image', body.image);
    if (body.image_after) formData.append('image_after', body.image_after);
    if (body.video) formData.append('video', body.video);

    return this.http.post<ProcedureResponse>(`${this.apiUrl}/${API_ENDPOINTS.USERS.PROCEDURES(user.id)}`, formData);
  }

  public editProcedure(payload: { procedureId: string, body: ProcedurePayload }): Observable<ProcedureResponse> {
    const user = this.userService.user();
    const formData = new FormData();
    const body = payload.body;

    const fileFields = ['image', 'image_after', 'video'];

    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined && value !== null && !fileFields.includes(key)) {
        formData.append(key, value.toString());
      }
    });

    if (this.isFile(body.image)) {
      formData.append('image', body.image);
    }

    if (this.isFile(body.image_after)) {
      formData.append('image_after', body.image_after);
    }

    if (this.isFile(body.video)) {
      formData.append('video', body.video);
    }
    
    return this.http.patch<ProcedureResponse>(
      `${this.apiUrl}/${API_ENDPOINTS.USERS.PROCEDURE(user.id, payload.procedureId)}`,
      formData
    );
  }

  public deleteProcedure(procedureId: string): Observable<void> {
    const user = this.userService.user();
    
    return this.http.delete<void>(`${this.apiUrl}/${API_ENDPOINTS.USERS.PROCEDURE(user.id, procedureId)}`);
  }

  private isFile(value: unknown): value is File {
    return typeof value === 'object' && value !== null && value instanceof File;
  }

  private setQueryParams(parameters: ProceduresQueryParams): HttpParams {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(parameters)) {
      if (value === undefined || value === null) {
        continue;
      }
      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (v === undefined || v === null) {
            return;
          }
          params = params.append(key, v);
        });
      } else {
        params = params.set(key, value as string);
      }
    }

    return params;
  }

  public getHospitals(parameters?: HospitalsQuery): Observable<PaginatedResponse<ProcedureHospital>> {
    let params = new HttpParams();
    
    if (parameters) {
      params = this.setQueryParams(parameters)
    }
    
    return this.http.get<PaginatedResponse<ProcedureHospital>>(`${this.apiUrl}/${API_ENDPOINTS.DOCTORS.HOSPITALS}`, { params });
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

  // private getTotalPages(data: PaginatedResponse<Procedure>): number {
  //   if (!data.count) {
  //     return 0;
  //   }

  //   const pageSize = this.getPageSize(data) ?? 20;
  //   return Math.ceil(data.count / pageSize);
  // }

  // private getPageSize(data: PaginatedResponse<Procedure>): number | null {
  //   const parseUrlPageSize = (url: string): number | null => {
  //     const match = url.match(/[?&](?:page_size|pageSize|size)=([0-9]+)/);
  //     return match ? Number(match[1]) : null;
  //   };

  //   if (typeof data.next === 'string' && data.next) {
  //     return parseUrlPageSize(data.next);
  //   }

  //   if (typeof data.previous === 'string' && data.previous) {
  //     return parseUrlPageSize(data.previous);
  //   }

  //   return null;
  // }
}
