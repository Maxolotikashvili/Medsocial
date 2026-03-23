import { User } from './user.model';

export interface ProceduresList {
  count: number;
  next: string;
  previous: string;
  results: Procedure[];
}

export interface Procedure {
  id: string;
  title: string;
  description: string;
  price: number;
  discounted_price: number;
  user: User;
  address: Address;
  hospital: string;
  image: string;
  image_after: string;
  video: string;
  is_favorite: string;
  created_at: Date;
}

export interface Address {
  id: string;
  country: {
    id: number;
    name: string;
    code: string;
    phone_code: string;
  };
  city: {
    id: number;
    name: string;
  };
  region: string;
  street: string;
  phone: string;
  text: string;
}

export interface ProceduresQueryParams {
  city?: string,
  country?: string,
  hospital?: string,
  max_price?: number,
  min_price?: number,
  name?: string,
  order?: 'title' | '-title' | 'price' | '-price',
  page?: number,
  title?: string
}