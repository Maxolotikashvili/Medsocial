import { inject, Injectable } from '@angular/core';
import { API_URL } from '../tokens/api-injection-token';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CitiesResponse, CountriesResponse, LanguagesResponse, TimezonesResponse } from '../models/location.model';
import { API_ENDPOINTS } from '../configs/api-endpoints.config';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private http = inject(HttpClient);
  private api_url: string = inject(API_URL);

  constructor() {}

  public getCountries(): Observable<CountriesResponse> {
    return this.http.get<CountriesResponse>(`${this.api_url}/${API_ENDPOINTS.ADDRESS.COUNTRIES}`);
  }
  
  public getCities(): Observable<CitiesResponse> {
    return this.http.get<CitiesResponse>(`${this.api_url}/${API_ENDPOINTS.ADDRESS.CITIES}`);
  }
  
  public getLanguages(): Observable<LanguagesResponse> {
    return this.http.get<LanguagesResponse>(`${this.api_url}/${API_ENDPOINTS.ADDRESS.LANGUAGES}`);
  }
  
  public getTimezones(): Observable<TimezonesResponse> {
    return this.http.get<TimezonesResponse>(`${this.api_url}/${API_ENDPOINTS.ADDRESS.TIMEZONES}`);
  }
}
