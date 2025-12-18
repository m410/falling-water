import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '@falling-water/share';
import { CategoryService, Category } from '@falling-water/share';

@Component({
  selector: 'bo-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Products</h2>
      <a routerLink="/products/new" class="btn btn-primary">
        <i class="bi bi-plus-lg me-1"></i>
        Add Product
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
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th class="text-end">Price</th>
                <th class="text-end">Stock</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (product of products(); track product.id) {
                <tr>
                  <td>{{ product.id }}</td>
                  <td>
                    @if (product.images.length) {
                      <img
                        [src]="product.images[0].image_url"
                        [alt]="product.name"
                        class="rounded"
                        style="width: 40px; height: 40px; object-fit: cover;"
                      />
                    } @else {
                      <div
                        class="bg-light rounded d-flex align-items-center justify-content-center"
                        style="width: 40px; height: 40px;"
                      >
                        <i class="bi bi-image text-muted"></i>
                      </div>
                    }
                  </td>
                  <td>
                    <strong>{{ product.name }}</strong>
                    @if (product.description) {
                      <br />
                      <small class="text-muted">{{
                        product.description | slice : 0 : 50
                      }}{{ product.description.length > 50 ? '...' : '' }}</small>
                    }
                  </td>
                  <td>{{ getCategoryName(product.category_id) }}</td>
                  <td class="text-end">{{ product.price | currency }}</td>
                  <td class="text-end">
                    <span
                      [class]="
                        product.stock_quantity < 10
                          ? 'badge bg-warning'
                          : 'badge bg-success'
                      "
                    >
                      {{ product.stock_quantity }}
                    </span>
                  </td>
                  <td class="text-end">
                    <a
                      [routerLink]="['/products', product.id, 'edit']"
                      class="btn btn-sm btn-outline-primary me-1"
                    >
                      <i class="bi bi-pencil"></i>
                    </a>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      (click)="deleteProduct(product)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="text-center text-muted py-4">
                    No products found
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
              Showing {{ startItem() }}-{{ endItem() }} of {{ total() }} products
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
export class ProductList implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);

  protected products = signal<Product[]>([]);
  protected categories = signal<Category[]>([]);
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
    this.loadCategories();
    this.loadProducts();
  }

  private loadCategories(): void {
    this.categoryService.findAll().subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => {},
    });
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService.findPage(this.currentPage(), this.pageSize()).subscribe({
      next: (result) => {
        this.products.set(result.data);
        this.total.set(result.total);
        this.totalPages.set(result.totalPages);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Failed to load products');
        this.loading.set(false);
      },
    });
  }

  protected goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) {
      return;
    }
    this.currentPage.set(page);
    this.loadProducts();
  }

  protected getCategoryName(categoryId: number | null): string {
    if (!categoryId) return '-';
    const cat = this.categories().find((c) => c.id === categoryId);
    return cat?.name || '-';
  }

  protected deleteProduct(product: Product): void {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    this.productService.delete(product.id).subscribe({
      next: () => {
        if (this.products().length === 1 && this.currentPage() > 1) {
          this.currentPage.update((p) => p - 1);
        }
        this.loadProducts();
      },
      error: (err) => {
        alert(err.error?.error || 'Failed to delete product');
      },
    });
  }
}
