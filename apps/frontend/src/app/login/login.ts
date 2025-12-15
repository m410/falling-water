import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@falling-water/shared/auth';
import { Field, form } from '@angular/forms/signals';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [Field, RouterLink],
  templateUrl: './login.html',
  encapsulation: ViewEncapsulation.None,
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected credentials = signal({ email: '', password: '' });
  protected form = form(this.credentials);
  protected error = signal<string | null>(null);
  protected loading = signal(false);

  constructor() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/account']);
    }
  }

  protected onSubmit($event: Event): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.loading.set(true);

    const credentials = this.credentials();
    this.authService.login(credentials.email, credentials.password).subscribe({
      next: () => {
        this.router.navigate(['/account']);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Invalid credentials');
        this.loading.set(false);
      },
    });
  }
}
