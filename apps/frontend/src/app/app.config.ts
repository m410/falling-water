import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor, AUTH_CONFIG } from '@falling-water/share';

import { provideZxvbnServiceForPSM } from 'angular-password-strength-meter/zxcvbn';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideZxvbnServiceForPSM(),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: AUTH_CONFIG,
      useValue: {
        loginRedirectPath: '/',
        unauthorizedRedirectPath: '/',
      },
    },
  ],
};
