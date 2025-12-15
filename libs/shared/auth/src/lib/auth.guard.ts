import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { AUTH_CONFIG, DEFAULT_AUTH_CONFIG } from './auth.config';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  let config = DEFAULT_AUTH_CONFIG;
  try {
    config = inject(AUTH_CONFIG);
  } catch {
    // Use default config if not provided
  }

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree([config.loginRedirectPath]);
};

export const roleGuard = (requiredRole: string): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    let config = DEFAULT_AUTH_CONFIG;
    try {
      config = inject(AUTH_CONFIG);
    } catch {
      // Use default config if not provided
    }

    if (authService.hasRole(requiredRole)) {
      return true;
    }

    return router.createUrlTree([config.loginRedirectPath], {
      queryParams: { error: `${requiredRole}_required` },
    });
  };
};

export const adminGuard: CanActivateFn = roleGuard('admin');
