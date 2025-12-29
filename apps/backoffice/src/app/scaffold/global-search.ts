import { SlicePipe } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  type ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  GlobalSearchService,
  type GroupedSearchResults,
  type SearchResult,
} from '@falling-water/share';
import { debounceTime, distinctUntilChanged, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'bo-global-search',
  template: `
    <div class="global-search" #searchContainer>
      <div class="input-group">
        <span class="input-group-text">
          <span class="bi bi-search" aria-label="search"></span>
        </span>
        <input
          #searchInput
          autocomplete="off"
          type="search"
          class="form-control"
          aria-label="Global search"
          placeholder="Search users, products, systems, suppliers..."
          [ngModel]="query()"
          (ngModelChange)="onQueryChange($event)"
          (focus)="showResults.set(true)"
          (keydown)="onKeydown($event)"
        />
        @if (loading()) {
          <span class="input-group-text">
            <span class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
          </span>
        }
      </div>

      @if (showResults() && hasResults()) {
        <div class="search-results" (click)="$event.stopPropagation()">
          @if (results().users.length > 0) {
            <div class="result-group">
              <div class="group-header">
                <span class="bi bi-people"></span> Users
              </div>
              @for (item of results().users; track item.id; let i = $index) {
                <div
                  class="result-item"
                  [class.active]="activeIndex() === getUserIndex(i)"
                  (click)="selectResult(item)"
                  (mouseenter)="activeIndex.set(getUserIndex(i))">
                  <span class="bi {{ item.icon }}"></span>
                  <div class="result-content">
                    <div class="result-name">{{ item.name }}</div>
                    @if (item.description) {
                      <div class="result-description">{{ item.description }}</div>
                    }
                  </div>
                </div>
              }
            </div>
          }

          @if (results().products.length > 0) {
            <div class="result-group">
              <div class="group-header">
                <span class="bi bi-box-seam"></span> Products
              </div>
              @for (item of results().products; track item.id; let i = $index) {
                <div
                  class="result-item"
                  [class.active]="activeIndex() === getProductIndex(i)"
                  (click)="selectResult(item)"
                  (mouseenter)="activeIndex.set(getProductIndex(i))">
                  <span class="bi {{ item.icon }}"></span>
                  <div class="result-content">
                    <div class="result-name">{{ item.name }}</div>
                    @if (item.description) {
                      <div class="result-description">{{ item.description | slice:0:50 }}{{ item.description.length > 50 ? '...' : '' }}</div>
                    }
                  </div>
                </div>
              }
            </div>
          }

          @if (results().systems.length > 0) {
            <div class="result-group">
              <div class="group-header">
                <span class="bi bi-gear"></span> Systems
              </div>
              @for (item of results().systems; track item.id; let i = $index) {
                <div
                  class="result-item"
                  [class.active]="activeIndex() === getSystemIndex(i)"
                  (click)="selectResult(item)"
                  (mouseenter)="activeIndex.set(getSystemIndex(i))">
                  <span class="bi {{ item.icon }}"></span>
                  <div class="result-content">
                    <div class="result-name">{{ item.name }}</div>
                    @if (item.description) {
                      <div class="result-description">{{ item.description | slice:0:50 }}{{ item.description.length > 50 ? '...' : '' }}</div>
                    }
                  </div>
                </div>
              }
            </div>
          }

          @if (results().suppliers.length > 0) {
            <div class="result-group">
              <div class="group-header">
                <span class="bi bi-truck"></span> Suppliers
              </div>
              @for (item of results().suppliers; track item.id; let i = $index) {
                <div
                  class="result-item"
                  [class.active]="activeIndex() === getSupplierIndex(i)"
                  (click)="selectResult(item)"
                  (mouseenter)="activeIndex.set(getSupplierIndex(i))">
                  <span class="bi {{ item.icon }}"></span>
                  <div class="result-content">
                    <div class="result-name">{{ item.name }}</div>
                    @if (item.description) {
                      <div class="result-description">{{ item.description }}</div>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </div>
      } @else if (showResults() && query().length >= 2 && !loading() && !hasResults()) {
        <div class="search-results">
          <div class="no-results">No results found for "{{ query() }}"</div>
        </div>
      }
    </div>
  `,
  styles: [`
    .global-search {
      position: relative;
      width: 100%;
    }

    .input-group {
      width: 100%;
    }

    .input-group-text {
      background-color: var(--bs-body-bg);
      border-color: var(--bs-border-color);
    }

    .form-control {
      border-left: 0;
    }

    .form-control:focus {
      border-color: var(--bs-border-color);
      box-shadow: none;
    }

    .search-results {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--bs-body-bg);
      border: 1px solid var(--bs-border-color);
      border-top: none;
      border-radius: 0 0 0.375rem 0.375rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      max-height: 400px;
      overflow-y: auto;
      z-index: 1050;
    }

    .result-group {
      border-bottom: 1px solid var(--bs-border-color);
    }

    .result-group:last-child {
      border-bottom: none;
    }

    .group-header {
      padding: 0.5rem 1rem;
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
      color: var(--bs-secondary);
      background: var(--bs-tertiary-bg);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .result-item {
      display: flex;
      align-items: center;
      padding: 0.625rem 1rem;
      cursor: pointer;
      gap: 0.75rem;
      transition: background-color 0.15s ease;
    }

    .result-item:hover,
    .result-item.active {
      background-color: var(--bs-tertiary-bg);
    }

    .result-item .bi {
      font-size: 1.1rem;
      color: var(--bs-secondary);
      width: 1.5rem;
      text-align: center;
    }

    .result-content {
      flex: 1;
      min-width: 0;
    }

    .result-name {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .result-description {
      font-size: 0.8rem;
      color: var(--bs-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .no-results {
      padding: 1rem;
      text-align: center;
      color: var(--bs-secondary);
    }
  `],
  imports: [FormsModule, OverlayModule, SlicePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSearch {
  private readonly searchService = inject(GlobalSearchService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly searchSubject = new Subject<string>();

  searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  searchContainer = viewChild<ElementRef<HTMLDivElement>>('searchContainer');

  query = signal('');
  loading = signal(false);
  showResults = signal(false);
  activeIndex = signal(-1);

  results = signal<GroupedSearchResults>({
    users: [],
    products: [],
    systems: [],
    suppliers: []
  });

  hasResults = computed(() => {
    const r = this.results();
    return r.users.length > 0 || r.products.length > 0 || r.systems.length > 0 || r.suppliers.length > 0;
  });

  totalResults = computed(() => {
    const r = this.results();
    return r.users.length + r.products.length + r.systems.length + r.suppliers.length;
  });

  allResults = computed(() => {
    const r = this.results();
    return [...r.users, ...r.products, ...r.systems, ...r.suppliers];
  });

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.loading.set(true)),
      switchMap(query => this.searchService.search(query)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(results => {
      this.results.set(results);
      this.loading.set(false);
      this.activeIndex.set(-1);
    });

    // Close results when clicking outside
    if (typeof document !== 'undefined') {
      document.addEventListener('click', (event) => {
        const container = this.searchContainer()?.nativeElement;
        if (container && !container.contains(event.target as Node)) {
          this.showResults.set(false);
        }
      });
    }
  }

  onQueryChange(value: string): void {
    this.query.set(value);
    this.showResults.set(true);
    this.searchSubject.next(value);
  }

  onKeydown(event: KeyboardEvent): void {
    const total = this.totalResults();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (this.activeIndex() < total - 1) {
          this.activeIndex.update(i => i + 1);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (this.activeIndex() > 0) {
          this.activeIndex.update(i => i - 1);
        }
        break;
      case 'Enter': {
        event.preventDefault();
        const all = this.allResults();
        if (this.activeIndex() >= 0 && this.activeIndex() < all.length) {
          this.selectResult(all[this.activeIndex()]);
        }
        break;
      }
      case 'Escape':
        this.showResults.set(false);
        this.searchInput()?.nativeElement.blur();
        break;
    }
  }

  selectResult(result: SearchResult): void {
    this.router.navigate([result.route]);
    this.showResults.set(false);
    this.query.set('');
    this.results.set({
      users: [],
      products: [],
      systems: [],
      suppliers: []
    });
  }

  // Index calculation helpers
  getUserIndex(i: number): number {
    return i;
  }

  getProductIndex(i: number): number {
    return this.results().users.length + i;
  }

  getSystemIndex(i: number): number {
    return this.results().users.length + this.results().products.length + i;
  }

  getSupplierIndex(i: number): number {
    return this.results().users.length + this.results().products.length + this.results().systems.length + i;
  }
}
