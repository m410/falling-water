import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@falling-water/shared/auth';
import { Field, form } from '@angular/forms/signals';

interface RegisterResponse {
  token: string;
  message?: string;
}

@Component({
  standalone: true,
  imports: [Field, RouterLink],
  templateUrl: './register.html',
  encapsulation: ViewEncapsulation.None,
})
export class Register {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected error = signal<string | null>(null);
  protected loading = signal(false);


  protected registration = signal({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  })

  protected registerForm = form(this.registration, {})

  constructor() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/account']);
    }
  }

  protected onSubmit($event: Event): void {
    $event.preventDefault();
    $event.stopPropagation();
    // todo https://github.com/antoantonyk/password-strength-meter?tab=readme-ov-file
    this.loading.set(true);
    console.log('Submitting registration form with data:', this.registerForm().value());
    // todo replace with api service
    this.http
      .post<RegisterResponse>('/api/users', this.registerForm().value())
      .subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          if (response.token) {
            this.authService.setToken(response.token);
            this.router.navigate(['/system']);
          } else {
            this.router.navigate(['/login']);
          }
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Registration failed:', err);
          this.error.set(err.error?.error || 'Registration failed. Please try again.');
        },
        complete: () => {
          console.log('Registration request completed');
          this.loading.set(false);
        }
      });
  }
}
