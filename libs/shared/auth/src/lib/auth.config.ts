import { InjectionToken } from '@angular/core';

export interface AuthConfig {
  loginRedirectPath: string;
  unauthorizedRedirectPath: string;
  requiredRole?: string;
}

export const AUTH_CONFIG = new InjectionToken<AuthConfig>('AUTH_CONFIG');

export const DEFAULT_AUTH_CONFIG: AuthConfig = {
  loginRedirectPath: '/login',
  unauthorizedRedirectPath: '/',
};
