import { Component, inject, ViewEncapsulation } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@falling-water/share';
import { Router } from '@angular/router';

@Component({
  selector: 'bo-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  encapsulation: ViewEncapsulation.None,
})
export class Layout {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected user = this.authService.user;

  protected logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
