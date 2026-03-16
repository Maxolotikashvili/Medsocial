export interface DecodedTokenType {
  exp: number,
  iat: number,
  jti: string,
  token_type: string,
  user_id: string
}

export interface User {
  id: string;
  slug: string;
  first_name: string;
  last_name: string;
  email: string;
  title: string;
  image: string;
  dob: string;
  bio: string;
  age_is_public: boolean;
  total_operations: number;
  timezone: string;
  phone?: string;
  role: 1 | 2;
  is_verified: boolean;
  phone_verified: boolean;
  email_verified: boolean;
  is_active: boolean;
  languages: [
    {
      name: string;
      code: string;
    },
  ];
  rating?: number
}