import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bo-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Users Management</h2>
    <div class="card">
      <div class="card-body">
        <p class="text-muted">
          User management functionality will be implemented here.
        </p>
      </div>
    </div>
  `,
})
export class Users {}
