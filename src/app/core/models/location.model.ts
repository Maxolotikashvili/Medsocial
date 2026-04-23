export interface CitiesResponse {
  count: number;
  next: string;
  previous: string;
  results: City[];
}

export interface City {
  id: number;
  name: string;
}

export interface CountriesResponse {
  count: number;
  next: string;
  previous: string;
  results: Country[];
}

export interface Country {
  id: number;
  name: string;
  code: string;
  phone_code: string;
}

export interface LanguagesResponse {}

export interface Timezone {
  id: number;
  name: string;
  zone: string;
}

export interface CitiesQuery {
  country?: string;
  page?: number;
  q?: string;
}

export interface CountriesQuery {
  page?: number;
  q?: string;
}

export interface TimezonesQuery {
  q?: string;
}

export interface Address {
  id: string,
  country: Country,
  city: City,
  region: string,
  street: string,
  phone: string,
  text: string
};

export interface AddressPayload {
  country_id: number,
  city_id: number,
  region: string,
  street: string,
  phone: string,
  text: string
}

export interface AddressResponse extends AddressPayload {
  id: string
}