import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UserService, User } from '@falling-water/share';

@Component({
  selector: 'bo-users',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Users Management</h2>
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
                <th>Name</th>
                <th>Email</th>
                <th>Roles</th>
                <th>Created</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (user of users(); track user.id) {
                <tr>
                  <td>{{ user.id }}</td>
                  <td>
                    <strong>{{ user.name }}</strong>
                  </td>
                  <td>{{ user.email }}</td>
                  <td>
                    @for (role of user.roles; track role) {
                      <span class="badge bg-secondary me-1">{{ role }}</span>
                    }
                  </td>
                  <td>{{ user.created_at | date : 'short' }}</td>
                  <td class="text-end">
                    <button
                      class="btn btn-sm btn-outline-danger"
                      (click)="deleteUser(user)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="text-center text-muted py-4">
                    No users found
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
              Showing {{ startItem() }}-{{ endItem() }} of {{ total() }} users
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
export class Users implements OnInit {
  private readonly userService = inject(UserService);

  protected users = signal<User[]>([]);
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
    this.loadUsers();
  }

  private loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.userService.findPage(this.currentPage(), this.pageSize()).subscribe({
      next: (result) => {
        this.users.set(result.data);
        this.total.set(result.total);
        this.totalPages.set(result.totalPages);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Failed to load users');
        this.loading.set(false);
      },
    });
  }

  protected goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) {
      return;
    }
    this.currentPage.set(page);
    this.loadUsers();
  }

  protected deleteUser(user: User): void {
    if (!confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      return;
    }

    this.userService.delete(user.id).subscribe({
      next: () => {
        if (this.users().length === 1 && this.currentPage() > 1) {
          this.currentPage.update((p) => p - 1);
        }
        this.loadUsers();
      },
      error: (err) => {
        alert(err.error?.error || 'Failed to delete user');
      },
    });
  }
}
