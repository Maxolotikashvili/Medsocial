import { User } from './user.model';

export interface ProceduresList {
  count: number;
  next: string;
  previous: string;
  results: Procedure[];
  totalPages: number
}

export interface Procedure {
  id: string;
  title: string;
  description: string;
  price: number;
  discounted_price: number;
  user: User;
  address: ProcedureAddress;
  category: ProcedureCategory;
  hospital: string;
  image: string;
  image_after: string;
  video: string;
  is_favorite: string;
  created_at: Date;
}

export interface ProcedureCategory {
  description: string | null;
  id: string;
  title: ProcedureCategoryTitle;
}

export type ProcedureCategoryTitle =
  | 'Rhinoplasty (nose reshaping)'
  | 'Mammoplasty'
  | 'Breast augmentation'
  | 'Breast reduction'
  | 'Breast lift (mastopexy)'
  | 'Liposuction'
  | 'Abdominoplasty (tummy tuck)'
  | 'Facelift (rhytidectomy)'
  | 'Blepharoplasty (eyelid surgery)'
  | 'Otoplasty (ear reshaping)'
  | 'Chin augmentation (genioplasty)'
  | 'Neck lift'
  | 'Brazilian butt lift (BBL)'
  | 'Dental implants'
  | 'Veneers'
  | 'Teeth whitening'
  | 'Dental crowns'
  | 'Bridges'
  | 'Root canal treatment (endodontics)'
  | 'Orthodontics (braces, aligners)'
  | 'Gum grafting'
  | 'Tooth extraction (including wisdom teeth removal)'
  | 'Angioplasty (balloon dilation of arteries)'
  | 'Coronary artery bypass grafting (CABG)'
  | 'Pacemaker implantation'
  | 'Heart valve repair/replacement'
  | 'Cardiac catheterization';

export interface ProcedureAddress {
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
  city?: string;
  country?: string;
  hospital?: string;
  max_price?: number;
  min_price?: number;
  name?: string;
  category_title?: ProcedureCategoryTitle,
  order?: 'title' | '-title' | 'price' | '-price';
  page?: number;
  title?: string;
  q?: string;
}
