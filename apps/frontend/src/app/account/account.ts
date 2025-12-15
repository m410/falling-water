import { Component, inject, signal, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AccountService } from './account.service';
import { User, Order } from './account.model';

@Component({
  selector: 'app-account',
  imports: [CommonModule, RouterLink, DatePipe, CurrencyPipe],
  templateUrl: './account.html',
  encapsulation: ViewEncapsulation.None,
})
export class Account implements OnInit {
  private accountService = inject(AccountService);

  user = signal<User | null>(null);
  orders = signal<Order[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.accountService.getProfile().subscribe({
      next: (profile) => {
        this.user.set(profile.user);
        this.orders.set(profile.orders);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load account information. Please try again.');
        this.loading.set(false);
        console.error('Error loading profile:', err);
      },
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-success';
      case 'pending':
        return 'bg-warning text-dark';
      case 'cancelled':
        return 'bg-danger';
      case 'processing':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }
}
