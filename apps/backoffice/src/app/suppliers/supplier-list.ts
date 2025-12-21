import { Component, inject, signal, OnInit, computed, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupplierService, Supplier } from '@falling-water/share';

@Component({
  selector: 'bo-supplier-list',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="display-1 mb-3">Suppliers</h1>
      <a routerLink="/suppliers/new" class="btn btn-primary">
        <i class="bi bi-plus-lg me-1"></i>
        Add Supplier
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
        <div class="table-responsive">
          <table class="table table-hover table-striped mb-0">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Website</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (supplier of suppliers(); track supplier.id) {
                <tr>
                  <td>{{ supplier.id }}</td>
                  <td>
                    <strong>{{ supplier.name }}</strong>
                    @if (supplier.notes) {
                      <br />
                      <small class="text-muted">{{
                        supplier.notes | slice : 0 : 50
                      }}{{ supplier.notes.length > 50 ? '...' : '' }}</small>
                    }
                  </td>
                  <td>
                    @if (supplier.email) {
                      <a [href]="'mailto:' + supplier.email">{{ supplier.email }}</a>
                    } @else {
                      <span class="text-muted">-</span>
                    }
                  </td>
                  <td>{{ supplier.phone || '-' }}</td>
                  <td>
                    @if (supplier.website) {
                      <a [href]="supplier.website" target="_blank" rel="noopener">
                        <i class="bi bi-box-arrow-up-right"></i>
                      </a>
                    } @else {
                      <span class="text-muted">-</span>
                    }
                  </td>
                  <td class="text-end">
                    <a
                      [routerLink]="['/suppliers', supplier.id, 'edit']"
                      class="btn btn-sm btn-outline-primary me-1"
                      title="Edit"
                    >
                      <i class="bi bi-pencil"></i>
                    </a>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      (click)="deleteSupplier(supplier)"
                      title="Delete"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="text-center text-muted py-4">
                    No suppliers found
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
              Showing {{ startItem() }}-{{ endItem() }} of {{ total() }} suppliers
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
    }
  `,
})
export class SupplierList implements OnInit {
  private readonly supplierService = inject(SupplierService);

  protected suppliers = signal<Supplier[]>([]);
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
    this.loadSuppliers();
  }

  private loadSuppliers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.supplierService.findPage(this.currentPage(), this.pageSize()).subscribe({
      next: (result) => {
        this.suppliers.set(result.data);
        this.total.set(result.total);
        this.totalPages.set(result.totalPages);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Failed to load suppliers');
        this.loading.set(false);
      },
    });
  }

  protected goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) {
      return;
    }
    this.currentPage.set(page);
    this.loadSuppliers();
  }

  protected deleteSupplier(supplier: Supplier): void {
    if (!confirm(`Are you sure you want to delete "${supplier.name}"?`)) {
      return;
    }

    this.supplierService.delete(supplier.id).subscribe({
      next: () => {
        if (this.suppliers().length === 1 && this.currentPage() > 1) {
          this.currentPage.update((p) => p - 1);
        }
        this.loadSuppliers();
      },
      error: (err) => {
        alert(err.error?.error || 'Failed to delete supplier');
      },
    });
  }
}
