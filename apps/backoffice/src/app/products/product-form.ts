import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import {
  ProductService,
  CreateProductDTO, Label, UpdateProductDTO
} from '@falling-water/share';
import { CategoryService, Category } from '@falling-water/share';
import { Field, form } from '@angular/forms/signals';

interface ImageEntry {
  id?: number;
  image_url: string;
  display_order: number;
}

@Component({
  selector: 'bo-product-form',
  standalone: true,
  imports: [Field, RouterLink, Label],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>{{ isEdit() ? 'Edit Product' : 'New Product' }}</h2>
      <a routerLink="/products" class="btn btn-outline-secondary">
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

          <form (submit)="onSubmit($event)">
            <div class="row">
              <div class="col-md-8">
                <fwe-label [label]="'Name'">
                  <input
                    type="text"2
                    class="form-control"
                    id="name"
                    [field]="form.name"
                  />
                </fwe-label>
                <fwe-label [label]="'Description'">
                  <textarea
                    class="form-control"
                    id="description"
                    [field]="form.description"
                    rows="3"
                  ></textarea>
                </fwe-label>

                <div class="row">
                  <div class="col-md-6">
                    <fwe-label [label]="'Price'">
                      <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input
                          type="number"
                          class="form-control"
                          id="price"
                          [field]="form.price"
                          step="0.01"
                        />
                      </div>
                    </fwe-label>
                  </div>
                  <div class="col-md-6">
                    <fwe-label [label]="'Stock quantity'">
                      <input
                        type="number"
                        class="form-control"
                        id="stockQuantity"
                        [field]="form.stock_quantity"
                      />
                    </fwe-label>
                  </div>
                </div>

                <fwe-label [label]="'Category'">
                  <select
                    class="form-select"
                    id="categoryId"
                    type="number"
                    [field]="form.category_id"
                  >
                    <option [value]="null">No Category</option>
                    @for (cat of categories(); track cat.id) {
                      <option [value]="cat.id">{{ cat.name }}</option>
                    }
                  </select>
                </fwe-label>

                <!-- Product Images -->
                <div class="mb-3">
                  <label class="form-label">Product Images</label>
                  @for (image of images(); track $index) {
                    <div class="input-group mb-2">
                      <input
                        type="url"
                        class="form-control"
                        [name]="'image_' + $index"
                        [field]="form.images[$index].image_url"
                      />
                      <button
                        type="button"
                        class="btn btn-outline-danger"
                        (click)="removeImage($index)"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  }
                  <button
                    type="button"
                    class="btn btn-outline-secondary btn-sm"
                    (click)="addImage()"
                  >
                    <i class="bi bi-plus-lg me-1"></i>
                    Add Image
                  </button>
                </div>
              </div>

              <div class="col-md-4">
                @if (images().length > 0 && images()[0].image_url) {
                  <div class="card">
                    <div class="card-header">Image Preview</div>
                    <div class="card-body">
                      <div class="row g-2">
                        @for (image of images(); track $index) {
                          @if (image.image_url) {
                            <div class="col-6">
                              <img
                                [src]="image.image_url"
                                [alt]="'Product'"
                                class="img-fluid rounded"
                                style="max-height: 100px; width: 100%; object-fit: cover;"
                              />
                            </div>
                          }
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>

            <div class="d-flex gap-2 mt-3">
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="form().invalid || saving()"
              >
                @if (saving()) {
                  <span class="spinner-border spinner-border-sm me-1"></span>
                }
                {{ isEdit() ? 'Update' : 'Create' }} Product
              </button>
              <a routerLink="/products" class="btn btn-outline-secondary">
                Cancel
              </a>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class ProductForm implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected images = signal<ImageEntry[]>([]);

  protected isEdit = signal(false);
  protected loading = signal(false);
  protected saving = signal(false);
  protected error = signal<string | null>(null);
  protected categories = signal<Category[]>([]);
  protected productId: number | null = null;

  protected readonly product = signal<CreateProductDTO | UpdateProductDTO>({
    name: '',
    description: '',
    price: 0,
    stock_quantity: 0,
    category_id: null,
    images: []
  });

  protected readonly form = form(this.product);

  ngOnInit(): void {
    this.loadCategories();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.productId = parseInt(idParam, 10);
      this.isEdit.set(true);
      this.loadProduct();
    }
  }

  private loadCategories(): void {
    this.categoryService.findAll().subscribe({
      next: (data) => this.categories.set(data),
      error: () => {
      }
    });
  }

  private loadProduct(): void {
    if (!this.productId) return;

    this.loading.set(true);
    this.productService.findById(this.productId).subscribe({
      next: (product) => {
        this.product.set(product);
        this.images.set(
          product.images.map((img) => ({
            id: img.id,
            image_url: img.image_url,
            display_order: img.display_order
          }))
        );
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Failed to load product');
        this.loading.set(false);
      }
    });
  }

  protected addImage(): void {
    this.images.update((imgs) => [
      ...imgs,
      { image_url: '', display_order: imgs.length }
    ]);
  }

  protected removeImage(index: number): void {
    this.images.update((imgs) => {
      const newImages = imgs.filter((_, i) => i !== index);
      return newImages.map((img, i) => ({ ...img, display_order: i }));
    });
  }

  protected onSubmit($event: Event): void {
    $event.preventDefault();
    $event.stopPropagation();

    this.saving.set(true);
    this.error.set(null);

    const validImages = this.images().filter((img) => img.image_url.trim());

    const request$ = this.isEdit()
      ? this.productService.update(this.productId!, this.product() as UpdateProductDTO)
      : this.productService.create(this.product() as CreateProductDTO);

    request$.subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Failed to save product');
        this.saving.set(false);
      }
    });
  }
}
