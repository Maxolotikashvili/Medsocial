import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, filter, switchMap, take, throwError, BehaviorSubject } from 'rxjs';
import { Authservice } from '../services/auth.service';

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Authservice);

  if (req.url.includes('/auth/')) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      if (isRefreshing) {
        return refreshSubject.pipe(
          filter((token) => token !== null),
          take(1),
          switchMap((token) => {
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`,
              },
            });

            return next(retryReq);
          }),
        );
      }

      isRefreshing = true;
      refreshSubject.next(null);

      return authService.refreshToken().pipe(
        switchMap((res) => {
          const newToken = res.access;

          refreshSubject.next(newToken);
          isRefreshing = false;

          const retryReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${newToken}`,
            },
          });

          return next(retryReq);
        }),

        catchError((err) => {
          isRefreshing = false;
          authService.logOut();

          return throwError(() => err);
        }),
      );
    }),
  );
};
