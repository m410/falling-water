import { Component, computed, inject, signal, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@falling-water/share';
import { Field, form } from '@angular/forms/signals';
import { PasswordStrengthMeterComponent } from 'angular-password-strength-meter';

interface RegisterResponse {
  token: string;
  message?: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [Field, PasswordStrengthMeterComponent],
  templateUrl: './login.html',
  encapsulation: ViewEncapsulation.None,
})
export class Login {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Login form
  protected credentials = signal({ email: '', password: '' });
  protected loginForm = form(this.credentials);
  protected loginError = signal<string | null>(null);
  protected loginLoading = signal(false);

  // Register form
  protected registration = signal({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  protected registerForm = form(this.registration, {});
  protected registerError = signal<string | null>(null);
  protected registerLoading = signal(false);

  protected readonly password = computed(() => {
    return this.registerForm.password().value();
  });

  constructor() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/account']);
    }
  }

  protected onLogin($event: Event): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.loginLoading.set(true);

    const credentials = this.credentials();
    this.authService.login(credentials.email, credentials.password).subscribe({
      next: () => {
        this.router.navigate(['/account']);
        this.loginLoading.set(false);
      },
      error: (err) => {
        this.loginError.set(err.error?.error || 'Invalid credentials');
        this.loginLoading.set(false);
      },
    });
  }

  protected onRegister($event: Event): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.registerLoading.set(true);

    this.http
      .post<RegisterResponse>('/api/users', this.registerForm().value())
      .subscribe({
        next: (response) => {
          if (response.token) {
            this.authService.setToken(response.token);
            this.router.navigate(['/system']);
          } else {
            this.router.navigate(['/login']);
          }
          this.registerLoading.set(false);
        },
        error: (err) => {
          this.registerError.set(err.error?.error || 'Registration failed. Please try again.');
          this.registerLoading.set(false);
        },
      });
  }
}