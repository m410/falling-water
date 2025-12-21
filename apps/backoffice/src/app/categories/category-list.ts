import { Component, inject, signal, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService, Category } from '@falling-water/share';

@Component({
  selector: 'bo-category-list',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="display-1 mb-3">Categories</h1>
      <a routerLink="/categories/new" class="btn btn-primary">
        <i class="bi bi-plus-lg me-1"></i>
        Add Category
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
        <div class="table-responsive">
          <table class="table table-hover table-striped table-striped mb-0">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Parent Category</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (category of categories(); track category.id) {
                <tr>
                  <td>{{ category.id }}</td>
                  <td>{{ category.name }}</td>
                  <td>{{ getParentName(category.parent_id) }}</td>
                  <td class="text-end">
                    <a
                      [routerLink]="['/categories', category.id, 'edit']"
                      class="btn btn-sm btn-outline-primary me-1"
                    >
                      <i class="bi bi-pencil"></i>
                    </a>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      (click)="deleteCategory(category)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="4" class="text-center text-muted py-4">
                    No categories found
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
    }
  `,
})
export class CategoryList implements OnInit {
  private readonly categoryService = inject(CategoryService);

  protected categories = signal<Category[]>([]);
  protected loading = signal(true);
  protected error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.loading.set(true);
    this.error.set(null);

    this.categoryService.findAll().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Failed to load categories');
        this.loading.set(false);
      },
    });
  }

  protected getParentName(parentId: number | null): string {
    if (!parentId) return '-';
    const parent = this.categories().find((c) => c.id === parentId);
    return parent?.name || '-';
  }

  protected deleteCategory(category: Category): void {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return;
    }

    this.categoryService.delete(category.id).subscribe({
      next: () => {
        this.categories.update((cats) =>
          cats.filter((c) => c.id !== category.id)
        );
      },
      error: (err) => {
        alert(err.error?.error || 'Failed to delete category');
      },
    });
  }
}
