import { Component, inject, ViewEncapsulation } from '@angular/core';
import { Footer } from './footer';
import { Header } from './header';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-layout',
  imports: [Footer, Header, RouterOutlet],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="container">
          <app-header></app-header>

      <div class="row">
        <main class="col-md-10 offset-md-1 p-3">
          <router-outlet></router-outlet>
        </main>
      </div>
      <div class="row mt-4">
        <footer class="col-md-8 offset-md-2 text-muted text-center">
          <app-footer></app-footer>
        </footer>
      </div>
    </div>
  `
})
export class Layout {
}
