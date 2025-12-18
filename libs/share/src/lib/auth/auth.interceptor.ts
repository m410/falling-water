import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AUTH_CONFIG, DEFAULT_AUTH_CONFIG } from './auth.config';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  let config = DEFAULT_AUTH_CONFIG;
  try {
    config = inject(AUTH_CONFIG);
  } catch {
    // Use default config if not provided
  }

  const skipUrls = ['/api/login', '/api/register', '/api/public'];
  const shouldSkip = skipUrls.some((url) => req.url.includes(url));

  if (!shouldSkip) {
    const token = authService.getToken();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.removeToken();
        router.navigate([config.loginRedirectPath]);
      }
      return throwError(() => error);
    })
  );
};
