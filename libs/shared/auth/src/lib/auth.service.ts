import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
  token: string;
}

export interface TokenPayload {
  id: number;
  username: string;
  role: string;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly userSignal = signal<TokenPayload | null>(null);

  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.userSignal() !== null);
  readonly isAdmin = computed(() => this.userSignal()?.role === 'admin');
  readonly role = computed(() => this.userSignal()?.role ?? null);

  constructor(private http: HttpClient) {
    this.loadStoredToken();
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('/api/login', { username: email, password })
      .pipe(
        tap((response) => {
          this.setToken(response.token);
        })
      );
  }

  logout(): void {
    this.removeToken();
    this.userSignal.set(null);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.userSignal.set(this.decodeToken(token));
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.userSignal.set(null);
  }

  hasRole(role: string): boolean {
    return this.userSignal()?.role === role;
  }

  private loadStoredToken(): void {
    const token = this.getToken();
    if (token) {
      const payload = this.decodeToken(token);
      if (payload && payload.exp * 1000 > Date.now()) {
        this.userSignal.set(payload);
      } else {
        this.removeToken();
      }
    }
  }

  private decodeToken(token: string): TokenPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }
}
