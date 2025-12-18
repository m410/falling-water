import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SystemService, System } from '@falling-water/share';

@Component({
  selector: 'bo-system-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DecimalPipe],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Systems</h2>
      <a routerLink="/systems/new" class="btn btn-primary">
        <i class="bi bi-plus-lg me-1"></i>
        Add System
      </a>
    </div>

    @if (loading()) {
      <div class="d-flex justify-content-center p-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    } @else if (error()) {
      <div class="alert alert-danger">{{ error() }}</div>
    } @else {
      <div class="card">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Flow Rate (m³/s)</th>
                <th>Head (m)</th>
                <th>Status</th>
                <th>Products</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (system of systems(); track system.id) {
                <tr>
                  <td>{{ system.id }}</td>
                  <td>
                    <strong>{{ system.name }}</strong>
                    @if (system.description) {
                      <br />
                      <small class="text-muted">{{
                        system.description | slice : 0 : 50
                      }}{{ system.description.length > 50 ? '...' : '' }}</small>
                    }
                  </td>
                  <td>
                    {{ system.min_flow_rate_cms | number : '1.2-2' }} -
                    {{ system.max_flow_rate_cms | number : '1.2-2' }}
                  </td>
                  <td>
                    {{ system.min_head_mt | number : '1.2-2' }} -
                    {{ system.max_head_mt | number : '1.2-2' }}
                  </td>
                  <td>
                    <span [class]="getStatusBadgeClass(system.status)">
                      {{ system.status }}
                    </span>
                  </td>
                  <td>
                    <span class="badge bg-secondary">
                      {{ system.product_ids.length }}
                    </span>
                  </td>
                  <td class="text-end">
                    <a
                      [routerLink]="['/systems', system.id, 'edit']"
                      class="btn btn-sm btn-outline-primary me-1"
                    >
                      <i class="bi bi-pencil"></i>
                    </a>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      (click)="deleteSystem(system)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="text-center text-muted py-4">
                    No systems found
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        @if (totalPages() > 1) {
          <div class="card-footer d-flex justify-content-between align-items-center">
            <div class="text-muted">
              Showing {{ startItem() }}-{{ endItem() }} of {{ total() }} systems
            </div>
            <nav>
              <ul class="pagination pagination-sm mb-0">
                <li class="page-item" [class.disabled]="currentPage() === 1">
                  <button
                    class="page-link"
                    (click)="goToPage(currentPage() - 1)"
                    [disabled]="currentPage() === 1"
                  >
                    Previous
                  </button>
                </li>
                @for (p of pageNumbers(); track p) {
                  <li class="page-item" [class.active]="p === currentPage()">
                    <button class="page-link" (click)="goToPage(p)">
                      {{ p }}
                    </button>
                  </li>
                }
                <li class="page-item" [class.disabled]="currentPage() === totalPages()">
                  <button
                    class="page-link"
                    (click)="goToPage(currentPage() + 1)"
                    [disabled]="currentPage() === totalPages()"
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        }
      </div>
    }
  `,
})
export class SystemList implements OnInit {
  private readonly systemService = inject(SystemService);

  protected systems = signal<System[]>([]);
  protected loading = signal(true);
  protected error = signal<string | null>(null);
  protected currentPage = signal(1);
  protected pageSize = signal(10);
  protected total = signal(0);
  protected totalPages = signal(0);

  protected startItem = computed(() => {
    if (this.total() === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize() + 1;
  });

  protected endItem = computed(() => {
    return Math.min(this.currentPage() * this.pageSize(), this.total());
  });

  protected pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);

    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(total, start + 4);
      } else if (end === total) {
        start = Math.max(1, end - 4);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  });

  ngOnInit(): void {
    this.loadSystems();
  }

  private loadSystems(): void {
    this.loading.set(true);
    this.error.set(null);

    this.systemService.findPage(this.currentPage(), this.pageSize()).subscribe({
      next: (result) => {
        this.systems.set(result.data);
        this.total.set(result.total);
        this.totalPages.set(result.totalPages);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Failed to load systems');
        this.loading.set(false);
      },
    });
  }

  protected goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) {
      return;
    }
    this.currentPage.set(page);
    this.loadSystems();
  }

  protected getStatusBadgeClass(status: string): string {
    const baseClass = 'badge ';
    switch (status.toLowerCase()) {
      case 'active':
        return baseClass + 'bg-success';
      case 'inactive':
        return baseClass + 'bg-secondary';
      case 'maintenance':
        return baseClass + 'bg-warning text-dark';
      default:
        return baseClass + 'bg-secondary';
    }
  }

  protected deleteSystem(system: System): void {
    if (!confirm(`Are you sure you want to delete "${system.name}"?`)) {
      return;
    }

    this.systemService.delete(system.id).subscribe({
      next: () => {
        if (this.systems().length === 1 && this.currentPage() > 1) {
          this.currentPage.update((p) => p - 1);
        }
        this.loadSystems();
      },
      error: (err) => {
        alert(err.error?.error || 'Failed to delete system');
      },
    });
  }
}
