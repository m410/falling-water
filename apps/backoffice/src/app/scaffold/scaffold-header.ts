import { Component, ViewEncapsulation } from '@angular/core';
import { ScaffoldSidebar } from './scaffold-sidebar';
import { ScaffoldNav } from './scaffold-nav';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ScaffoldTree } from './scaffold-tree';
import { ScaffoldMenu } from './scaffold-menu';

@Component({
  selector: 'bo-scaffold-header',
  template: `
    <nav class="navbar fixed-top bg-body-tertiary">
      <div class="container-fluid mt-1">
        <form class="d-flex w-100" role="search" autocomplete="off" novalidate>
          <button
            style="border: 0; border-bottom: 2px solid var(--bs-secondary); border-radius: 0"
            class="btn btn-outline-success" type="submit">
            <span class="bi bi-search"></span></button>
          <input
            style="border: 0; border-bottom: 2px solid var(--bs-secondary); border-radius: 0"
            class="fwe form-control w-100"
            type="search"
            placeholder="Search"
            aria-label="Search"
            id="menu-search" />
          <label class="visually-hidden" for="menu-seaerch">Search</label>
          <div class="nav-item m-auto ps-3">
            <a [routerLink]="['/logout']" class="nav-link"><i class="bi bi-box-arrow-right"></i></a>
          </div>
        </form>

      </div>
    </nav>
  `,
  imports: [
    RouterLink
  ],
  encapsulation: ViewEncapsulation.None
})
export class ScaffoldHeader {
}
