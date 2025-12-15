import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bo-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Orders Management</h2>
    <div class="card">
      <div class="card-body">
        <p class="text-muted">
          Order management functionality will be implemented here.
        </p>
      </div>
    </div>
  `,
})
export class Orders {}
