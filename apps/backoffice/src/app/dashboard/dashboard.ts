import { Component, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { UserService, OrderService, PaymentService } from '@falling-water/share';

@Component({
  selector: 'bo-dashboard',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <h1 class="display-1 mb-3">Dashboard</h1>
    <div class="row">
      <div class="col-md-4 mb-3">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <h5 class="card-title">
              <i class="bi bi-people me-2"></i>
              Users
            </h5>
            <p class="card-text display-4">{{ userCount() }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card bg-success text-white">
          <div class="card-body">
            <h5 class="card-title">
              <i class="bi bi-cart-check me-2"></i>
              Orders
            </h5>
            <p class="card-text display-4">{{ orderCount() }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card bg-info text-white">
          <div class="card-body">
            <h5 class="card-title">
              <i class="bi bi-currency-dollar me-2"></i>
              Revenue
            </h5>
            <p class="card-text display-4">{{ revenue() === '--' ? '--' : (revenue() | currency) }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class Dashboard implements OnInit {
  private readonly userService = inject(UserService);
  private readonly orderService = inject(OrderService);
  private readonly paymentService = inject(PaymentService);

  protected userCount = signal<number | string>('--');
  protected orderCount = signal<number | string>('--');
  protected revenue = signal<number | string>('--');

  ngOnInit(): void {
    this.userService.findPage(1, 1).subscribe({
      next: (result) => this.userCount.set(result.total),
      error: () => this.userCount.set('--'),
    });

    this.orderService.findPage(1, 1).subscribe({
      next: (result) => this.orderCount.set(result.total),
      error: () => this.orderCount.set('--'),
    });

    this.paymentService.sumLastMonth().subscribe({
      next: (result) => this.revenue.set(result.sum),
      error: () => this.revenue.set('--'),
    });
  }
}
