import { Component, output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'bo-scaffold-nav',
  imports: [],
  template: `
    <nav class="navbar navbar-dark bg-dark px-3">
      <button class="btn btn-outline-light me-3 d-none d-md-inline" (click)="toggleSidebar.emit()">
        <i class="bi bi-layout-sidebar"></i>
      </button>

      <button class="btn btn-outline-light me-3 d-md-none" (click)="openFlyout.emit()">
        <i class="bi bi-list"></i>
      </button>

      <form class="d-flex flex-grow-1 me-3">
        <input
          class="fwe form-control"
          type="search"
          placeholder="Global search..."
        />
      </form>

      <span class="navbar-text text-light">Dashboard</span>
    </nav>`,
  encapsulation: ViewEncapsulation.None,
})
export class ScaffoldNav {
  readonly toggleSidebar = output<void>();
  readonly openFlyout = output<void>();
}
