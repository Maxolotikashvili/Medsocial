import { inject, Injectable } from '@angular/core';
import { API_URL } from '../tokens/api-injection-token';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Address, AddressPayload, AddressResponse, CitiesQuery, CitiesResponse, CountriesQuery, CountriesResponse, LanguagesResponse, Timezone } from '../models/location.model';
import { API_ENDPOINTS } from '../configs/api-endpoints.config';
import { filterObjectWithValues } from '../../shared/utilities/value-filterer-object.utility';
import { PaginatedResponse } from '../models/procedures.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private http = inject(HttpClient);
  private api_url: string = inject(API_URL);
  private userService = inject(UserService);
  
  private user = this.userService.user();

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

  public getAddresses(): Observable<PaginatedResponse<Address>> {
    return this.http.get<PaginatedResponse<Address>>(`${this.api_url}/${API_ENDPOINTS.USERS.ADDRESSES(this.user.id)}`);
  }

  public getAddress(addressId: string): Observable<Address> {

    return this.http.get<Address>(`${this.api_url}/${API_ENDPOINTS.USERS.ADDRESS(this.user.id, addressId)}`);
  }

  public updateAddress(payload: { addressId: string, body: AddressPayload }): Observable<AddressPayload> {
    return this.http.patch<AddressPayload>(`${this.api_url}/${API_ENDPOINTS.USERS.ADDRESS(this.user.id, payload.addressId)}`, payload.body);
  }

  public createAddress(newAddress: AddressPayload): Observable<AddressResponse> {
    return this.http.post<AddressResponse>(`${this.api_url}/${API_ENDPOINTS.USERS.ADDRESSES(this.user.id)}`, newAddress);
  }

  public deleteAddress(addressId: string): Observable<void> {
    return this.http.delete<void>(`${this.api_url}/${API_ENDPOINTS.USERS.ADDRESS(this.user.id, addressId)}`);
  }
}
