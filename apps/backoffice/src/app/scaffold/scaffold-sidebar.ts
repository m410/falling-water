import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'bo-scaffold-sidebar',
  template: `
    <div
      class="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary"
      style="width: 280px; height: 100vh">
      <a
        [routerLink]="['/scaffold']"
        class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
        <img src="/falling-water-4.1.svg" alt="falling water energy icon" style="height: 1.5rem" class="me-2">
        <span class="fs-4">Falling water (office)</span>
      </a>
      <ul class="nav nav-pills flex-column mb-auto">
        <li class="nav-item mt-4">
          <a [routerLink]="['/']" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"
             class="fwe nav-link link-body-emphasis">
            <i class="me-2 bi bi-speedometer2"></i>
            Dashboard
          </a></li>
        <li><a [routerLink]="['/users']" routerLinkActive="active" class="fwe nav-link link-body-emphasis">
          <i class="me-2 bi bi-people"></i>
          Users
        </a></li>
        <li><a [routerLink]="['/products']" routerLinkActive="active" class="fwe nav-link link-body-emphasis">
          <i class="me-2 bi bi-box-seam"></i>
          Products
        </a></li>
        <li><a [routerLink]="['/categories']" routerLinkActive="active" class="fwe nav-link link-body-emphasis">
          <i class="me-2 bi bi-tags"></i>
          Categories
        </a></li>
        <li><a [routerLink]="['/orders']" routerLinkActive="active" class="fwe nav-link link-body-emphasis">
          <i class="me-2 bi bi-cart4"></i>
          Orders
        </a></li>
        <li><a [routerLink]="['/systems']" routerLinkActive="active" class="fwe nav-link link-body-emphasis">
          <i class="me-2 bi bi-droplet-half"></i>
          System
        </a></li>
        <li><a [routerLink]="['/suppliers']" routerLinkActive="active" class="fwe nav-link link-body-emphasis">
          <i class="me-2 bi bi-filter-square"></i>
          Suppliers
        </a></li>
      </ul>
      <!--      <hr>-->
      <!--      <div class="dropdown"><a-->
      <!--        href="#"-->
      <!--        class="d-flex align-items-center link-body-emphasis text-decoration-none dropdown-toggle"-->
      <!--        data-bs-toggle="dropdown" aria-expanded="false">-->
      <!--        <img src="https://github.com/mdo.png"-->
      <!--             alt="" width="32" height="32"-->
      <!--             class="rounded-circle me-2">-->
      <!--        <strong>mdo</strong> </a>-->
      <!--        <ul class="dropdown-menu text-small shadow">-->
      <!--          <li><a class="dropdown-item" href="#">New project...</a></li>-->
      <!--          <li><a class="dropdown-item" href="#">Settings</a></li>-->
      <!--          <li><a class="dropdown-item" href="#">Profile</a></li>-->
      <!--          <li>-->
      <!--            <hr class="dropdown-divider">-->
      <!--          </li>-->
      <!--          <li><a class="dropdown-item" href="#">Sign out</a></li>-->
      <!--        </ul>-->
      <!--      </div>-->
    </div>
  `,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  encapsulation: ViewEncapsulation.None
})
export class ScaffoldSidebar {
  // dash
  // user
  // category
  // product
  // order
  // system
  // suppliers
}
