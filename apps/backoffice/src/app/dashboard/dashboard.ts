import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bo-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Dashboard</h2>
    <div class="row">
      <div class="col-md-4 mb-3">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <h5 class="card-title">
              <i class="bi bi-people me-2"></i>
              Users
            </h5>
            <p class="card-text display-4">--</p>
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
            <p class="card-text display-4">--</p>
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
            <p class="card-text display-4">--</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class Dashboard {}
