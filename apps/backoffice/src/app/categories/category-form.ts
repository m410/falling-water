import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import {
  CategoryService,
  Category,
} from '@falling-water/share';
import { Field, form, maxLength, minLength, required } from '@angular/forms/signals';
import { Label } from '@falling-water/share';


interface CategoryForm1 {
  name: string;
  parent_id: string;
}

@Component({
  selector: 'bo-category-form',
  standalone: true,
  imports: [Field, RouterLink, Label],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>{{ isEdit() ? 'Edit Category' : 'New Category' }}</h2>
      <a routerLink="/categories" class="btn btn-outline-secondary">
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
    } @else {
      <div class="card">
        <div class="card-body">
          @if (error()) {
            <div class="alert alert-danger">{{ error() }}</div>
          }

          <form (submit)="onSubmit($event)" novalidate autocomplete="off">
            <fwe-label [label]="'Name'">
              <input
                type="text"
                id="name"
                [field]="form.name"
              />
            </fwe-label>

            <fwe-label [label]="'Parent category'">
              <select
                id="parentId"
                [field]="form.parent_id"
              >
                <option [value]="null">None (Top Level)</option>
                @for (cat of availableParents(); track cat.id) {
                  <option [value]="cat.id">{{ cat.name }}</option>
                }
              </select>
            </fwe-label>


            <div class="d-flex gap-2">
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="form().invalid() || saving()"
              >
                @if (saving()) {
                  <span class="spinner-border spinner-border-sm me-1"></span>
                }
                {{ isEdit() ? 'Update' : 'Create' }} Category
              </button>
              <a routerLink="/categories" class="btn btn-outline-secondary">
                Cancel
              </a>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class CategoryForm implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private categoryId: number | null = null;

  protected isEdit = signal(false);
  protected loading = signal(false);
  protected saving = signal(false);
  protected error = signal<string | null>(null);
  protected categories = signal<Category[]>([]);

  protected availableParents = signal<Category[]>([]);

  protected readonly category = signal<CategoryForm1>({
    name: '',
    parent_id: '',
  })

  protected form = form(this.category, (path) => {
    required(path.name);
    minLength(path.name, 6);
    maxLength(path.name, 64)
  })

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.categoryId = parseInt(idParam, 10);
      this.isEdit.set(true);
      this.loadCategory();
    }
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoryService.findAll().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.updateAvailableParents();
      },
      error: () => {},
    });
  }

  private updateAvailableParents(): void {
    const cats = this.categories().filter((c) => c.id !== this.categoryId);
    this.availableParents.set(cats);
  }

  private loadCategory(): void {
    if (!this.categoryId) return;

    this.loading.set(true);
    this.categoryService.findById(this.categoryId).subscribe({
      next: (category) => {
        // this.name = category.name;
        // this.parentId = category.parent_id;
        this.loading.set(false);
        this.updateAvailableParents();
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Failed to load category');
        this.loading.set(false);
      },
    });
  }

  protected onSubmit($event: Event): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.form.name().markAsTouched();
    this.form.parent_id().markAsTouched();

    if(this.form().valid()) {
      const saveCategory = this.category();
      const change = {...saveCategory,
        parent_id : saveCategory.parent_id ? parseInt(saveCategory.parent_id, 10) : null
      };
      console.log(change);
      const request$ = this.isEdit()
        ? this.categoryService.update(this.categoryId!, change)
        : this.categoryService.create(change);

      request$.subscribe({
        next: () => {
          this.router.navigate(['/categories']);
        },
        error: (err) => {
          this.error.set(err.error?.error || 'Failed to save category');
          this.saving.set(false);
        },
      });
    }
  }
}
