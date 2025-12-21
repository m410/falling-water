import { Component, inject, signal, OnInit, ViewEncapsulation, computed } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SystemService, System, ProductService, Product } from '@falling-water/share';

@Component({
  selector: 'bo-system-detail',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterLink, DecimalPipe, DatePipe, CurrencyPipe],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <a routerLink="/systems" class="btn btn-link ps-0">
          <i class="bi bi-arrow-left me-1"></i>
          Back to Systems
        </a>
        <h1 class="display-1 mb-0">{{ system()?.name || 'System Details' }}</h1>
      </div>
      @if (system()) {
        <a [routerLink]="['/systems', system()!.id, 'edit']" class="btn btn-primary">
          <i class="bi bi-pencil me-1"></i>
          Edit System
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
    } @else if (system()) {
      <div class="row">
        <!-- System Info -->
        <div class="col-md-8">
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">System Information</h5>
            </div>
            <div class="card-body">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="text-muted small">Name</label>
                  <p class="mb-0 fw-semibold">{{ system()!.name }}</p>
                </div>
                <div class="col-md-6">
                  <label class="text-muted small">Status</label>
                  <p class="mb-0">
                    <span [class]="getStatusBadgeClass(system()!.status)">
                      {{ system()!.status }}
                    </span>
                  </p>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="text-muted small">Flow Rate Range (m³/s)</label>
                  <p class="mb-0">
                    {{ system()!.min_flow_rate_cms | number:'1.2-2' }} - {{ system()!.max_flow_rate_cms | number:'1.2-2' }}
                  </p>
                </div>
                <div class="col-md-6">
                  <label class="text-muted small">Head Range (m)</label>
                  <p class="mb-0">
                    {{ system()!.min_head_mt | number:'1.2-2' }} - {{ system()!.max_head_mt | number:'1.2-2' }}
                  </p>
                </div>
              </div>
              @if (system()!.description) {
                <div class="mb-3">
                  <label class="text-muted small">Description</label>
                  <p class="mb-0">{{ system()!.description }}</p>
                </div>
              }
              <div class="row">
                <div class="col-md-6">
                  <label class="text-muted small">Created</label>
                  <p class="mb-0">{{ system()!.created_at | date:'medium' }}</p>
                </div>
                <div class="col-md-6">
                  <label class="text-muted small">Last Updated</label>
                  <p class="mb-0">{{ system()!.updated_at | date:'medium' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Quick Stats</h5>
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">System ID</span>
                <span class="fw-semibold">#{{ system()!.id }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Products</span>
                <span class="badge bg-secondary">{{ systemProducts().length }}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-muted">Total Value</span>
                <span class="fw-semibold text-success">{{ totalProductValue() | currency }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Products List -->
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="mb-0">Products in this System</h5>
          <span class="badge bg-secondary">{{ systemProducts().length }} products</span>
        </div>
        @if (productsLoading()) {
          <div class="card-body text-center">
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        } @else if (systemProducts().length === 0) {
          <div class="card-body text-center text-muted">
            No products assigned to this system
          </div>
        } @else {
          <div class="table-responsive">
            <table class="table table-hover table-striped mb-0">
              <thead class="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th class="text-end">Price</th>
                  <th class="text-end">Stock</th>
                  <th class="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (product of systemProducts(); track product.id) {
                  <tr>
                    <td>{{ product.id }}</td>
                    <td>
                      <strong>{{ product.name }}</strong>
                    </td>
                    <td>
                      @if (product.description) {
                        <small class="text-muted">
                          {{ product.description | slice:0:50 }}{{ product.description.length > 50 ? '...' : '' }}
                        </small>
                      } @else {
                        <span class="text-muted">-</span>
                      }
                    </td>
                    <td class="text-end">{{ product.price | currency }}</td>
                    <td class="text-end">
                      <span [class]="product.stock_quantity < 10 ? 'badge bg-warning' : 'badge bg-success'">
                        {{ product.stock_quantity }}
                      </span>
                    </td>
                    <td class="text-end">
                      <a [routerLink]="['/products', product.id]" class="btn btn-sm btn-outline-primary">
                        <i class="bi bi-eye"></i>
                      </a>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    }
  `,
})
export class SystemDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly systemService = inject(SystemService);
  private readonly productService = inject(ProductService);

  protected system = signal<System | null>(null);
  protected allProducts = signal<Product[]>([]);
  protected loading = signal(true);
  protected productsLoading = signal(true);
  protected error = signal<string | null>(null);

  protected systemProducts = computed(() => {
    const sys = this.system();
    const products = this.allProducts();
    if (!sys || !sys.product_ids || sys.product_ids.length === 0) {
      return [];
    }
    return products.filter(p => sys.product_ids.includes(p.id));
  });

  protected totalProductValue = computed(() => {
    return this.systemProducts().reduce((sum, p) => sum + (p.price * p.stock_quantity), 0);
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSystem(parseInt(id, 10));
      this.loadProducts();
    }
  }

  private loadSystem(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.systemService.findById(id).subscribe({
      next: (system) => {
        this.system.set(system);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Failed to load system');
        this.loading.set(false);
      },
    });
  }

  private loadProducts(): void {
    this.productsLoading.set(true);

    this.productService.findAll().subscribe({
      next: (products) => {
        this.allProducts.set(products);
        this.productsLoading.set(false);
      },
      error: () => {
        this.productsLoading.set(false);
      },
    });
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
}