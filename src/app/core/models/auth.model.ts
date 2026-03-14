export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  dob: string;
  password: string;
  password1: string;
  role?: 0 | 1;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface TokenRefreshResponse {
  access: string;
}

export interface TokenVerifyResponse {
  token: string;
}
