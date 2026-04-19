import { inject, Injectable } from '@angular/core';
import { API_URL } from '../tokens/api-injection-token';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CitiesQuery, CitiesResponse, CountriesQuery, CountriesResponse, LanguagesResponse, Timezone } from '../models/location.model';
import { API_ENDPOINTS } from '../configs/api-endpoints.config';
import { filterObjectWithValues } from '../../shared/utilities/value-filterer-object.utility';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private http = inject(HttpClient);
  private api_url: string = inject(API_URL);

  constructor() {}

  public getCountries(parameters: Partial<CountriesQuery>): Observable<CountriesResponse> {
    const filteredParameters = filterObjectWithValues(parameters);
    let params: HttpParams | undefined;
    
    if (Object.keys(filteredParameters).length > 0) { 
      params = new HttpParams({
        fromObject: filteredParameters as Record<string, string>,
      });
    }

  return this.http.get<CountriesResponse>(`${this.api_url}/${API_ENDPOINTS.ADDRESS.COUNTRIES}`, { params });
}

  public getCities(parameters: CitiesQuery): Observable<CitiesResponse> {
    const filteredParameters = filterObjectWithValues(parameters);
    let params: HttpParams | undefined;

    if (Object.keys(filteredParameters).length > 0) { 
      params = new HttpParams({
        fromObject: filteredParameters as Record<string, any>,
      });  
    }

    return this.http.get<CitiesResponse>(`${this.api_url}/${API_ENDPOINTS.ADDRESS.CITIES}`, { params: params });
  }
  
  public getLanguages(): Observable<LanguagesResponse> {
    return this.http.get<LanguagesResponse>(`${this.api_url}/${API_ENDPOINTS.ADDRESS.LANGUAGES}`);
  }
  
  public getTimezones(): Observable<Timezone[]> {
    return this.http.get<Timezone[]>(`${this.api_url}/${API_ENDPOINTS.ADDRESS.TIMEZONES}`);
  }
}
