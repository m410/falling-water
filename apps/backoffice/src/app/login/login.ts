import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, Label } from '@falling-water/share';
import { email, Field, form, required } from '@angular/forms/signals';


@Component({
  selector: 'bo-login',
  standalone: true,
  imports: [Field, Label],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './login.html',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected error = signal<string | null>(null);
  protected loading = signal(false);


  protected readonly login = signal({
    username: '',
    password: '',
  })

  protected readonly form = form(this.login, (path) => {
    required(path.username)
    email(path.username)
    required(path.password)
  });

  constructor() {
    const errorParam = this.route.snapshot.queryParamMap.get('error');
    if (errorParam === 'admin_required') {
      this.error.set('Admin access required for backoffice');
    }

    if (this.authService.isAdmin()) {
      this.router.navigate(['/']);
    }
  }


  protected onSubmit($event: Event): void {
    $event.preventDefault();
    $event.stopPropagation();

    this.error.set(null);
    this.loading.set(true);

    this.authService.login(this.form().value().username, this.form().value().password).subscribe({
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
