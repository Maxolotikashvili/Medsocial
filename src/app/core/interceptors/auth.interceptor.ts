import { HttpInterceptorFn } from "@angular/common/http";
import { StorageService } from "../services/storage.service";
import { inject } from "@angular/core";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const storageService = inject(StorageService);

    const token = storageService.get<string>('access_token');
    const authEndpoints = ['/token', '/register'];
    const isAuthRequest = authEndpoints.some(url => req.url.includes(url));

    if (token && !isAuthRequest) {
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        })

        return next(authReq);
    }

    return next(req);
}
