import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GlobalSearch } from './global-search';

@Component({
  selector: 'bo-scaffold-header',
  template: `
    <nav class="navbar fixed-top bg-body-tertiary">
      <div class="container-fluid mt-1">
        <div class="d-flex w-100 align-items-center gap-2">
          <bo-global-search class="flex-grow-1"></bo-global-search>
          <div class="nav-item">
            <a [routerLink]="['/logout']" class="nav-link"><i class="bi bi-box-arrow-right"></i></a>
          </div>
        </div>
      </div>
    </nav>
  `,
  imports: [
    RouterLink,
    GlobalSearch
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScaffoldHeader {
}
