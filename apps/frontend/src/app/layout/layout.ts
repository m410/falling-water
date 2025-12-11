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
  template: `
    <div class="container">
      <header class="row">
        <div class="col">
          <app-header></app-header>
        </div>
      </header>
    </div>
    
    @if (wideMain()) {
<main>
      <router-outlet></router-outlet>
    </main>
    }
    @else {
      <div class="container">
      <main class="row">
        <router-outlet></router-outlet>
      </main>
    </div>
    }
    
    <div class="container">
      <footer class="row">
        <div class="col">
          <app-footer></app-footer>
        </div>
      </footer>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class Layout {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  protected readonly wideMain = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.activatedRoute.firstChild),
      switchMap((child) => child?.data ?? of({ wideMain: false })),
      map((data) => data['wideMain'] === true)
    ),
    {
      initialValue: false,
    }
  );
}
