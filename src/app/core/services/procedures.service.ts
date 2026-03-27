import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Procedure, ProceduresList, ProceduresQueryParams } from '../models/procedures.model';
import { API_URL } from '../tokens/api-injection-token';
import { API_ENDPOINTS } from '../configs/api-endpoints.config';

@Injectable({
  providedIn: 'root',
})
export class ProceduresService {
  private http = inject(HttpClient);
  private apiUrl: string = inject(API_URL);

  private isFetchingProceduresSignal: WritableSignal<boolean> = signal<boolean>(false);
  public isFetchingProcedures: Signal<boolean> = this.isFetchingProceduresSignal.asReadonly();

  constructor() {}

  public getProceduresList(parameters?: ProceduresQueryParams): Observable<ProceduresList> {
    let params = new HttpParams({
      fromObject: parameters as Record<string, any>,
    });
    return this.http
      .get<ProceduresList>(`${this.apiUrl}/${API_ENDPOINTS.DOCTORS.PROCEDURES}`, { params })
      .pipe(
        map((data) => {
          return { ...data, totalPages: this.getTotalPages(data) };
        }),
      );
  }

  public getHospitals(procedures: Procedure[]): Procedure['hospital'][] {
    return procedures.map((procedure) => procedure.hospital);
  }

  public getCategories(procedures: Procedure[]) {
    return procedures.map((procedure) => procedure.category.title);
  }

  public mappedProceduresQueryParams(
    target: Record<string, string | number>,
  ): ProceduresQueryParams {
    const keyMap: Record<string, keyof ProceduresQueryParams> = {
      Country: 'q',
      City: 'q',
      Department: 'category_title',
      Hospitals: 'q',
      Search: 'q',
    };
    const acc: any = {};
    const searchTerms: string[] = [];

    for (const [key, val] of Object.entries(target)) {
      const valueStr = val.toString().trim();

      if (valueStr === '') continue;

      if (key === 'Department') {
        acc['category_title'] = valueStr;
      } else {
        searchTerms.push(valueStr);
      }

      if (searchTerms.length > 0) {
        acc['q'] = searchTerms.join(', ');
      }
    }
    console.log(acc)
    return acc as ProceduresQueryParams;
  }

  private getTotalPages(data: ProceduresList): number {
    return Math.ceil(data.count / (data.results.length || 1));
  }
}
