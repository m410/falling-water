import { Component, ViewEncapsulation } from '@angular/core';
import { ScaffoldSidebar } from './scaffold-sidebar';
import { RouterOutlet } from '@angular/router';
import { ScaffoldHeader } from './scaffold-header';

@Component({
  imports: [
    ScaffoldSidebar,
    RouterOutlet,
    ScaffoldHeader
  ],
  template: `
    <div class="d-flex flex-nowrap" style="height: 100vh; max-height: 100vh">
      <bo-scaffold-sidebar></bo-scaffold-sidebar>
      <div style="width: 100%; overflow-y: auto;">
        <bo-scaffold-header></bo-scaffold-header>
        <main class="flex-grow-1 p-4 fwe content-area">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>`,
  encapsulation: ViewEncapsulation.None
})
export class Scaffold {
  // todo two other options
  //  https://freefrontend.com/bootstrap-sidebars/
  //  https://codepen.io/hughbalboa/pen/zrgdKq

  sidebarMode: 'open' | 'icon' | 'flyout' = 'open';

  toggleSidebar(): void {
    if (this.sidebarMode === 'open') {
      this.sidebarMode = 'icon';
    } else if (this.sidebarMode === 'icon') {
      this.sidebarMode = 'open';
    }
  }

  openFlyout(): void {
    this.sidebarMode = 'flyout';
  }

  closeFlyout(): void {
    if (this.sidebarMode === 'flyout') {
      this.sidebarMode = 'icon';
    }
  }
}
