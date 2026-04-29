import { ApplicationConfig, APP_INITIALIZER, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { refreshInterceptor } from './core/interceptors/refresh.interceptor';
import { Authservice } from './core/services/auth.service';
import { lastValueFrom } from 'rxjs';
import { providePrimeNG } from 'primeng/config';
import { defaultPreset } from './core/configs/primeng-theme.config';

function initializeAuth(authService: Authservice) {
  return async () => {
    if (authService.access_token()) {
      await lastValueFrom(authService.refreshUser());
      authService.scheduleTokenRefresh();
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, refreshInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [Authservice],
      multi: true,
    },

    providePrimeNG({
      theme: {
        preset: defaultPreset,
        options: {
          darkModeSelector: '.dark-mode'
        }
      },
    }),
  ],
};
