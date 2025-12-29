import { Component, ViewEncapsulation, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, CartService } from '@falling-water/share';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="row mb-5 mt-3">

      <div class="col-12 col-md-5 offset-md-1 d-flex">
        <h1 class="text-accent1 display-6 float-md-start mb-0">
          <a [routerLink]="['/']" class="text-decoration-none text-accent1">
              <img
                src="falling-water-4.1.svg"
                alt="falling water energy logo"
                height="72px">
            Falling water energy
          </a>
        </h1>
      </div>
      <div class="col-12 col-md-5  d-flex justify-content-end align-items-center">
        <ul class="nav nav-underline mt-3 ">
          <li class="nav-item">
            <a class="nav-link text-info" routerLinkActive="active" [routerLink]="['/hydro-system']">Design</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-info" routerLinkActive="active" [routerLink]="['/store']">Store</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-info" routerLinkActive="active" [routerLink]="['/contact']">
              <i class="bi bi-envelope"></i>
            </a>
          </li>
          @if (cartService.itemCount() > 0) {
            <li class="nav-item">
              <a class="nav-link position-relative text-info" routerLinkActive="active" [routerLink]="['/cart']">
                <i class="bi bi-cart4"></i>
                <span class="cart-badge">{{ cartService.itemCount() }}</span>
              </a>
            </li>
          }
          <li class="nav-item">
            @if (authService.isAuthenticated()) {
              <a class="nav-link text-info" routerLinkActive="active" [routerLink]="['/account']">
                <span class="user-initials">{{ initials() }}</span>
              </a>
            } @else {
              <a class="nav-link text-info" routerLinkActive="active" [routerLink]="['/login']">
                <i class="bi bi-person-circle"></i>
              </a>
            }
          </li>
          @if (authService.isAuthenticated()) {
            <li class="nav-item">
              <a class="nav-link" href="#" (click)="logout($event)">
                <i class="bi bi-box-arrow-right"></i>
              </a>
            </li>
          }
        </ul>
      </div>
    </header>`,
  styles: `
    .user-initials {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.5em;
      height: 1.5em;
      border-radius: 50%;
      background-color: var(--bs-primary);
      color: white;
      font-size: 0.85em;
      font-weight: 600;
      text-transform: uppercase;
    }
    .cart-badge {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(25%, -25%);
      background-color: var(--bs-danger);
      color: white;
      font-size: 0.65em;
      font-weight: 600;
      padding: 0.2em 0.5em;
      border-radius: 10px;
      min-width: 1.2em;
      text-align: center;
    }
  `,
  encapsulation: ViewEncapsulation.None,
})
export class Header {
  protected authService = inject(AuthService);
  protected cartService = inject(CartService);

  protected initials = computed(() => {
    const user = this.authService.user();
    if (!user?.username) return '';
    const name = user.username.split('@')[0];
    const parts = name.split(/[._-]/);
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2);
  });

  protected logout($event: Event): void {
    $event.preventDefault();
    this.authService.logout();
  }
}
