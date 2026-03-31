export interface DecodedTokenType {
  exp: number;
  iat: number;
  jti: string;
  token_type: string;
  user_id: string;
}

export interface BaseUser {
  id: string;
  first_name: string;
  last_name: string;
  bio: string;
  dob: string;
  image: string;
  timezone: string;
  is_verified: boolean;
  phone_verified: boolean;
  email_verified: boolean;
  languages: Language[];
}

export interface ApiUser extends BaseUser {
  slug: string;
  email: string;
  title: string;
  age_is_public: boolean;
  total_operations: number;
  phone: string;
  role: number;
  is_active: boolean;
}

export interface Language {
  name: string;
  code: string;
}
