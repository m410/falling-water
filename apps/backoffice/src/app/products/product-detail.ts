import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, JsonPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService, Product, ProductAudit } from '@falling-water/share';
import { CategoryService, Category } from '@falling-water/share';

@Component({
  selector: 'bo-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe, JsonPipe],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <a routerLink="/products" class="btn btn-link ps-0">
          <i class="bi bi-arrow-left me-1"></i>
          Back to Products
        </a>
        <h2 class="mb-0">{{ product()?.name || 'Product Details' }}</h2>
      </div>
      @if (product()) {
        <a [routerLink]="['/products', product()!.id, 'edit']" class="btn btn-primary">
          <i class="bi bi-pencil me-1"></i>
          Edit Product
        </a>
      }
    </div>

    @if (loading()) {
      <div class="d-flex justify-content-center p-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    } @else if (error()) {
      <div class="alert alert-danger">{{ error() }}</div>
    } @else if (product()) {
      <div class="row">
        <!-- Product Info -->
        <div class="col-md-8">
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">Product Information</h5>
            </div>
            <div class="card-body">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="text-muted small">Name</label>
                  <p class="mb-0 fw-semibold">{{ product()!.name }}</p>
                </div>
                <div class="col-md-6">
                  <label class="text-muted small">Category</label>
                  <p class="mb-0">{{ getCategoryName(product()!.category_id) }}</p>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="text-muted small">Price</label>
                  <p class="mb-0 fw-semibold text-success">{{ product()!.price | currency }}</p>
                </div>
                <div class="col-md-6">
                  <label class="text-muted small">Stock Quantity</label>
                  <p class="mb-0">
                    <span [class]="product()!.stock_quantity < 10 ? 'badge bg-warning' : 'badge bg-success'">
                      {{ product()!.stock_quantity }}
                    </span>
                  </p>
                </div>
              </div>
              @if (product()!.description) {
                <div class="mb-3">
                  <label class="text-muted small">Description</label>
                  <p class="mb-0">{{ product()!.description }}</p>
                </div>
              }
              <div class="row">
                <div class="col-md-6">
                  <label class="text-muted small">Created</label>
                  <p class="mb-0">{{ product()!.created_at | date:'medium' }}</p>
                </div>
                <div class="col-md-6">
                  <label class="text-muted small">Last Updated</label>
                  <p class="mb-0">{{ product()!.updated_at | date:'medium' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Images -->
          @if (product()!.images.length) {
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">Images</h5>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  @for (image of product()!.images; track image.id) {
                    <div class="col-md-4">
                      <img
                        [src]="image.image_url"
                        [alt]="product()!.name"
                        class="img-fluid rounded"
                        style="max-height: 200px; object-fit: cover;"
                      />
                    </div>
                  }
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Sidebar -->
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Quick Stats</h5>
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Product ID</span>
                <span class="fw-semibold">#{{ product()!.id }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Images</span>
                <span>{{ product()!.images.length }}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-muted">Audit Entries</span>
                <span>{{ audits().length }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Audit History -->
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="mb-0">Audit History</h5>
          <span class="badge bg-secondary">{{ audits().length }} entries</span>
        </div>
        @if (auditsLoading()) {
          <div class="card-body text-center">
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        } @else if (audits().length === 0) {
          <div class="card-body text-center text-muted">
            No audit history available
          </div>
        } @else {
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Date</th>
                  <th>Operation</th>
                  <th>Changed By</th>
                  <th>Changed Fields</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                @for (audit of audits(); track audit.id) {
                  <tr>
                    <td>
                      <small>{{ audit.changed_at | date:'medium' }}</small>
                    </td>
                    <td>
                      <span [class]="getOperationBadgeClass(audit.operation)">
                        {{ audit.operation }}
                      </span>
                    </td>
                    <td>
                      @if (audit.changed_by_username) {
                        {{ audit.changed_by_username }}
                      } @else {
                        <span class="text-muted">System</span>
                      }
                    </td>
                    <td>
                      @if (audit.changed_fields && audit.changed_fields.length) {
                        <div class="d-flex flex-wrap gap-1">
                          @for (field of audit.changed_fields; track field) {
                            <span class="badge bg-light text-dark">{{ field }}</span>
                          }
                        </div>
                      } @else {
                        <span class="text-muted">-</span>
                      }
                    </td>
                    <td>
                      <button
                        class="btn btn-sm btn-outline-secondary"
                        (click)="toggleAuditDetails(audit.id)"
                      >
                        <i class="bi" [class.bi-chevron-down]="!expandedAuditId() || expandedAuditId() !== audit.id" [class.bi-chevron-up]="expandedAuditId() === audit.id"></i>
                      </button>
                    </td>
                  </tr>
                  @if (expandedAuditId() === audit.id) {
                    <tr>
                      <td colspan="5" class="bg-light">
                        <div class="row p-2">
                          @if (audit.old_data) {
                            <div class="col-md-6">
                              <h6 class="text-muted">Previous Values</h6>
                              <pre class="bg-white p-2 rounded small mb-0" style="max-height: 200px; overflow: auto;">{{ formatAuditData(audit.old_data, audit.changed_fields) | json }}</pre>
                            </div>
                          }
                          @if (audit.new_data) {
                            <div class="col-md-6">
                              <h6 class="text-muted">New Values</h6>
                              <pre class="bg-white p-2 rounded small mb-0" style="max-height: 200px; overflow: auto;">{{ formatAuditData(audit.new_data, audit.changed_fields) | json }}</pre>
                            </div>
                          }
                        </div>
                      </td>
                    </tr>
                  }
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    }
  `,
})
export class ProductDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);

  protected product = signal<Product | null>(null);
  protected audits = signal<ProductAudit[]>([]);
  protected categories = signal<Category[]>([]);
  protected loading = signal(true);
  protected auditsLoading = signal(true);
  protected error = signal<string | null>(null);
  protected expandedAuditId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadCategories();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(parseInt(id, 10));
    }
  }

  private loadCategories(): void {
    this.categoryService.findAll().subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => {},
    });
  }

  private loadProduct(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService.findById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.loading.set(false);
        this.loadAuditHistory(id);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Failed to load product');
        this.loading.set(false);
      },
    });
  }

  private loadAuditHistory(id: number): void {
    this.auditsLoading.set(true);

    this.productService.getAuditHistory(id).subscribe({
      next: (audits) => {
        this.audits.set(audits);
        this.auditsLoading.set(false);
      },
      error: () => {
        this.auditsLoading.set(false);
      },
    });
  }

  protected getCategoryName(categoryId: number | null): string {
    if (!categoryId) return '-';
    const cat = this.categories().find((c) => c.id === categoryId);
    return cat?.name || '-';
  }

  protected getOperationBadgeClass(operation: string): string {
    switch (operation) {
      case 'INSERT':
        return 'badge bg-success';
      case 'UPDATE':
        return 'badge bg-info';
      case 'DELETE':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  protected toggleAuditDetails(auditId: number): void {
    if (this.expandedAuditId() === auditId) {
      this.expandedAuditId.set(null);
    } else {
      this.expandedAuditId.set(auditId);
    }
  }

  protected formatAuditData(
    data: Record<string, unknown>,
    changedFields: string[] | null
  ): Record<string, unknown> {
    if (!changedFields || changedFields.length === 0) {
      return data;
    }

    const filtered: Record<string, unknown> = {};
    for (const field of changedFields) {
      if (field in data) {
        filtered[field] = data[field];
      }
    }
    return filtered;
  }
}
