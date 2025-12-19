import { Component, inject, signal, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService, Order, OrderItem } from '@falling-water/share';
import { ProductService, Product } from '@falling-water/share';
import { Field, form } from '@angular/forms/signals';

@Component({
  selector: 'bo-order-detail',
  standalone: true,
  imports: [Field, RouterLink, CurrencyPipe, DatePipe],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Order #{{ orderId }}</h2>
      <a routerLink="/orders" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left me-1"></i>
        Back to List
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
    } @else if (order()) {
      <div class="row">
        <div class="col-md-8">
          <!-- Order Items -->
          <div class="card mb-4">
            <div class="card-header">
              <i class="bi bi-box me-1"></i>
              Order Items
            </div>
            <div class="table-responsive">
              <table class="table mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Product</th>
                    <th class="text-center">Quantity</th>
                    <th class="text-end">Unit Price</th>
                    <th class="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of orderItems(); track item.id) {
                    <tr>
                      <td>{{ getProductName(item.product_id) }}</td>
                      <td class="text-center">{{ item.quantity }}</td>
                      <td class="text-end">{{ item.unit_price | currency }}</td>
                      <td class="text-end">
                        {{ item.quantity * item.unit_price | currency }}
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="4" class="text-center text-muted py-3">
                        No items in this order
                      </td>
                    </tr>
                  }
                </tbody>
                <tfoot class="table-light">
                  <tr>
                    <th colspan="3" class="text-end">Total:</th>
                    <th class="text-end">{{ order()!.total_amount | currency }}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <!-- Order Details -->
          <div class="card mb-4">
            <div class="card-header">
              <i class="bi bi-info-circle me-1"></i>
              Order Details
            </div>
            <div class="card-body">
              <dl class="row mb-0">
                <dt class="col-sm-5">Order ID</dt>
                <dd class="col-sm-7">#{{ order()!.id }}</dd>

                <dt class="col-sm-5">User ID</dt>
                <dd class="col-sm-7">{{ order()!.user_id || '-' }}</dd>

                <dt class="col-sm-5">Created</dt>
                <dd class="col-sm-7">{{ order()!.created_at | date : 'medium' }}</dd>

                <dt class="col-sm-5">Updated</dt>
                <dd class="col-sm-7">{{ order()!.updated_at | date : 'medium' }}</dd>
              </dl>
            </div>
          </div>

          <!-- Update Status -->
          <div class="card">
            <div class="card-header">
              <i class="bi bi-arrow-repeat me-1"></i>
              Update Status
            </div>
            <div class="card-body">
              @if (updateError()) {
                <div class="alert alert-danger py-2">{{ updateError() }}</div>
              }
              @if (updateSuccess()) {
                <div class="alert alert-success py-2">Status updated!</div>
              }

              <div class="mb-3">
                <label for="status" class="form-label">Status</label>
                <select
                  class="fwe form-select"
                  id="status"
                  [field]="form.status"
                >
                  @for (status of statusOptions; track status) {
                    <option [value]="status">{{ status }}</option>
                  }
                </select>
              </div>

              <button
                class="btn btn-primary w-100"
                (click)="updateStatus()"
                [disabled]="updating()"
              >
                @if (updating()) {
                  <span class="spinner-border spinner-border-sm me-1"></span>
                }
                Update Status
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class OrderDetail implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);

  protected orderId: number | null = null;
  protected order = signal<Order | null>(null);
  protected orderItems = signal<OrderItem[]>([]);
  protected products = signal<Product[]>([]);
  protected loading = signal(true);
  protected error = signal<string | null>(null);

  protected selectedStatus = '';
  protected updating = signal(false);
  protected updateError = signal<string | null>(null);
  protected updateSuccess = signal(false);

  protected statusOptions = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ];

  protected readonly status = signal({ status: 'processing' });
  protected readonly form = form(this.status);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.orderId = parseInt(idParam, 10);
      this.loadData();
    }
  }

  private loadData(): void {
    if (!this.orderId) return;

    this.loading.set(true);
    this.error.set(null);

    this.productService.findAll().subscribe({
      next: (prods) => this.products.set(prods),
      error: () => {},
    });

    this.orderService.findById(this.orderId).subscribe({
      next: (order) => {
        this.order.set(order);
        this.selectedStatus = order.status;
        this.loadOrderItems();
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Failed to load order');
        this.loading.set(false);
      },
    });
  }

  private loadOrderItems(): void {
    if (!this.orderId) return;

    this.orderService.getOrderItems(this.orderId).subscribe({
      next: (items) => {
        this.orderItems.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  protected getProductName(productId: number | null): string {
    if (!productId) return 'Unknown Product';
    const product = this.products().find((p) => p.id === productId);
    return product?.name || `Product #${productId}`;
  }

  protected updateStatus(): void {
    if (!this.orderId || !this.selectedStatus) return;

    this.updating.set(true);
    this.updateError.set(null);
    this.updateSuccess.set(false);

    this.orderService.update(this.orderId, { status: this.selectedStatus }).subscribe({
      next: (updated) => {
        this.order.set(updated);
        this.updating.set(false);
        this.updateSuccess.set(true);
        setTimeout(() => this.updateSuccess.set(false), 3000);
      },
      error: (err) => {
        this.updateError.set(err.error?.error || 'Failed to update status');
        this.updating.set(false);
      },
    });
  }
}
