import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Authservice } from "../services/auth.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Authservice);

  const token = authService.access_token();

  const authEndpoints = ['/auth/token/', '/auth/register/'];
  const isAuthRequest = authEndpoints.some(endpoint => req.url.includes(endpoint));

  if (!token || isAuthRequest) return next(req);

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};