import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@falling-water/shared/auth';

@Component({
  selector: 'bo-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected username = signal('');
  protected password = signal('');
  protected error = signal<string | null>(null);
  protected loading = signal(false);

  constructor() {
    const errorParam = this.route.snapshot.queryParamMap.get('error');
    if (errorParam === 'admin_required') {
      this.error.set('Admin access required for backoffice');
    }

    if (this.authService.isAdmin()) {
      this.router.navigate(['/']);
    }
  }

  protected onSubmit(): void {
    this.error.set(null);
    this.loading.set(true);

    this.authService.login(this.username(), this.password()).subscribe({
      next: () => {
        if (this.authService.isAdmin()) {
          this.router.navigate(['/']);
        } else {
          this.authService.logout();
          this.error.set('Admin access required for backoffice');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Invalid credentials');
        this.loading.set(false);
      },
    });
  }
}
