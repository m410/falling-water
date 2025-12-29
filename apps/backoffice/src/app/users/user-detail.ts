import { Component, inject, signal, type OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService, type User, OrderService, type Order } from '@falling-water/share';

@Component({
  selector: 'bo-user-detail',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <a routerLink="/users" class="btn btn-link ps-0">
          <i class="bi bi-arrow-left me-1"></i>
          Back to Users
        </a>
        <h1 class="display-1 mb-0">{{ user()?.name || 'User Details' }}</h1>
      </div>
    </div>

    @if (loading()) {
      <div class="d-flex justify-content-center p-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    } @else if (error()) {
      <div class="alert alert-danger">{{ error() }}</div>
    } @else if (user()) {
      <div class="row">
        <!-- User Info -->
        <div class="col-md-8">
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">User Information</h5>
            </div>
            <div class="card-body">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="text-muted small">Name</label>
                  <p class="mb-0 fw-semibold">{{ user()!.name }}</p>
                </div>
                <div class="col-md-6">
                  <label class="text-muted small">Username</label>
                  <p class="mb-0">{{ user()!.username || '-' }}</p>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="text-muted small">Email</label>
                  <p class="mb-0">
                    <a [href]="'mailto:' + user()!.email">{{ user()!.email }}</a>
                  </p>
                </div>
                <div class="col-md-6">
                  <label class="text-muted small">Phone</label>
                  <p class="mb-0">{{ user()!.phone || '-' }}</p>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="text-muted small">Roles</label>
                  <p class="mb-0">
                    @for (role of user()!.roles; track role) {
                      <span class="badge bg-primary me-1">{{ role }}</span>
                    } @empty {
                      <span class="text-muted">No roles assigned</span>
                    }
                  </p>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <label class="text-muted small">Created</label>
                  <p class="mb-0">{{ user()!.created_at | date:'medium' }}</p>
                </div>
                <div class="col-md-6">
                  <label class="text-muted small">Last Updated</label>
                  <p class="mb-0">{{ user()!.updated_at | date:'medium' }}</p>
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
                <span class="text-muted">User ID</span>
                <span class="fw-semibold">#{{ user()!.id }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Total Orders</span>
                <span>{{ orders().length }}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-muted">Total Spent</span>
                <span class="fw-semibold text-success">{{ getTotalSpent() | currency }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order History -->
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="mb-0">Order History</h5>
          <span class="badge bg-secondary">{{ orders().length }} orders</span>
        </div>
        @if (ordersLoading()) {
          <div class="card-body text-center">
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        } @else if (orders().length === 0) {
          <div class="card-body text-center text-muted">
            No orders found for this user
          </div>
        } @else {
          <div class="table-responsive">
            <table class="table table-hover table-striped mb-0">
              <thead class="table-light">
                <tr>
                  <th>Order ID</th>
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
                    <td>
                      <span [class]="getStatusBadgeClass(order.status)">
                        {{ order.status }}
                      </span>
                    </td>
                    <td class="text-end">{{ order.total_amount | currency }}</td>
                    <td>
                      <small>{{ order.created_at | date:'short' }}</small>
                    </td>
                    <td>
                      <small>{{ order.updated_at | date:'short' }}</small>
                    </td>
                    <td class="text-end">
                      <a
                        [routerLink]="['/orders', order.id]"
                        class="btn btn-sm btn-outline-primary"
                      >
                        <i class="bi bi-eye"></i> View
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
export class UserDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly orderService = inject(OrderService);

  protected user = signal<User | null>(null);
  protected orders = signal<Order[]>([]);
  protected loading = signal(true);
  protected ordersLoading = signal(true);
  protected error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadUser(parseInt(id, 10));
    }
  }

  private loadUser(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.userService.findById(id).subscribe({
      next: (user) => {
        this.user.set(user);
        this.loading.set(false);
        this.loadOrders(id);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Failed to load user');
        this.loading.set(false);
      },
    });
  }

  private loadOrders(userId: number): void {
    this.ordersLoading.set(true);

    this.orderService.findByUserId(userId).subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.ordersLoading.set(false);
      },
      error: () => {
        this.ordersLoading.set(false);
      },
    });
  }

  protected getTotalSpent(): number {
    return this.orders().reduce((sum, order) => sum + order.total_amount, 0);
  }

  protected getStatusBadgeClass(status: string): string {
    const baseClass = 'badge ';
    switch (status.toLowerCase()) {
      case 'pending':
        return `${baseClass}bg-warning text-dark`;
      case 'processing':
        return `${baseClass}bg-info`;
      case 'shipped':
        return `${baseClass}bg-primary`;
      case 'delivered':
        return `${baseClass}bg-success`;
      case 'cancelled':
        return `${baseClass}bg-danger`;
      default:
        return `${baseClass}bg-secondary`;
    }
  }
}
