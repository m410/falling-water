import { Component, inject, signal, OnInit, computed, ViewEncapsulation } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService, Order } from '@falling-water/share';

@Component({
  selector: 'bo-order-list',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="display-1 mb-3">Orders</h1>
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
                <th>Order ID</th>
                <th>User ID</th>
                <th>Status</th>
                <th class="text-end">Total</th>
                <th>Created</th>
                <th>Updated</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (order of orders(); track order.id) {
                <tr>
                  <td>
                    <strong>#{{ order.id }}</strong>
                  </td>
                  <td>{{ order.user_id || '-' }}</td>
                  <td>
                    <span [class]="getStatusBadgeClass(order.status)">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="text-end">{{ order.total_amount | currency }}</td>
                  <td>{{ order.created_at | date : 'short' }}</td>
                  <td>{{ order.updated_at | date : 'short' }}</td>
                  <td class="text-end">
                    <a
                      [routerLink]="['/orders', order.id]"
                      class="btn btn-sm btn-outline-primary me-1"
                    >
                      <i class="bi bi-eye"></i>
                    </a>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      (click)="deleteOrder(order)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="text-center text-muted py-4">
                    No orders found
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
              Showing {{ startItem() }}-{{ endItem() }} of {{ total() }} orders
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
export class OrderList implements OnInit {
  private readonly orderService = inject(OrderService);

  protected orders = signal<Order[]>([]);
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
    this.loadOrders();
  }

  private loadOrders(): void {
    this.loading.set(true);
    this.error.set(null);

    this.orderService.findPage(this.currentPage(), this.pageSize()).subscribe({
      next: (result) => {
        this.orders.set(result.data);
        this.total.set(result.total);
        this.totalPages.set(result.totalPages);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Failed to load orders');
        this.loading.set(false);
      },
    });
  }

  protected goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) {
      return;
    }
    this.currentPage.set(page);
    this.loadOrders();
  }

  protected getStatusBadgeClass(status: string): string {
    const baseClass = 'badge ';
    switch (status.toLowerCase()) {
      case 'pending':
        return baseClass + 'bg-warning text-dark';
      case 'processing':
        return baseClass + 'bg-info';
      case 'shipped':
        return baseClass + 'bg-primary';
      case 'delivered':
        return baseClass + 'bg-success';
      case 'cancelled':
        return baseClass + 'bg-danger';
      default:
        return baseClass + 'bg-secondary';
    }
  }

  protected deleteOrder(order: Order): void {
    if (!confirm(`Are you sure you want to delete order #${order.id}?`)) {
      return;
    }

    this.orderService.delete(order.id).subscribe({
      next: () => {
        if (this.orders().length === 1 && this.currentPage() > 1) {
          this.currentPage.update((p) => p - 1);
        }
        this.loadOrders();
      },
      error: (err) => {
        alert(err.error?.error || 'Failed to delete order');
      },
    });
  }
}
