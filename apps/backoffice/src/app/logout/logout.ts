import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@falling-water/share';

@Component({
  selector: 'bo-logout',
  standalone: true,
  template: '',
})
export class Logout {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}