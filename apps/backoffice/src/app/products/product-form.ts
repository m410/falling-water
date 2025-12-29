import { Component, inject, signal, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

import { Field, form } from '@angular/forms/signals';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

import {
  ProductService,
  Label,
  CategoryService,
  SupplierService,
  FileService
} from '@falling-water/share';

interface ImageEntry {
  id?: number;
  image_url: string;
  display_order: number;
}

interface Form {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: string,
  source: string;
  images: ImageEntry[];
}

@Component({
  selector: 'bo-product-form',
  standalone: true,
  imports: [Field, RouterLink, Label],
  templateUrl: './product-form.html',
  encapsulation: ViewEncapsulation.None
})
export class ProductForm implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly supplierService = inject(SupplierService);
  private readonly fileService = inject(FileService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected images = signal<ImageEntry[]>([]);

  protected isEdit = signal(false);
  protected loading = signal(false);
  protected saving = signal(false);
  protected error = signal<string | null>(null);
  protected uploading = signal<Set<number>>(new Set());
  protected categories = toSignal(this.categoryService.findAll(), {
    initialValue: []
  });

  protected suppliers = toSignal(this.supplierService.findAll().pipe(
    catchError(e => {
      console.error(e);
      return of([])
    })
  ), {
    initialValue: []
  });

  protected productId: number | null = null;

  protected readonly product = signal<Form>({
    name: '',
    description: '',
    price: 0,
    stock_quantity: 0,
    category_id: '',
    source: '',
    images: []
  });

  protected readonly form = form(this.product);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.productId = parseInt(idParam, 10);
      this.isEdit.set(true);
      this.loadProduct();
    }
  }

  private loadProduct(): void {
    if (!this.productId) return;

    this.loading.set(true);
    this.productService.findById(this.productId).subscribe({
      next: (product) => {
        this.product.set(product as any);
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

  protected updateImageUrl(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.images.update((imgs) =>
      imgs.map((img, i) => (i === index ? { ...img, image_url: input.value } : img))
    );
  }

  protected uploadImage(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploading.update(set => new Set(set).add(index));

    this.fileService.uploadImage(file).subscribe({
      next: (result) => {
        this.images.update((imgs) =>
          imgs.map((img, i) => (i === index ? { ...img, image_url: result.url } : img))
        );
        this.uploading.update(set => {
          const newSet = new Set(set);
          newSet.delete(index);
          return newSet;
        });
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Failed to upload image');
        this.uploading.update(set => {
          const newSet = new Set(set);
          newSet.delete(index);
          return newSet;
        });
      }
    });

    input.value = '';
  }

  protected isUploading(index: number): boolean {
    return this.uploading().has(index);
  }

  protected onSubmit($event: Event): void {
    $event.preventDefault();
    $event.stopPropagation();

    this.saving.set(true);
    this.error.set(null);

    const validImages = this.images().filter((img) => img.image_url.trim());

    // fixme
    // const request$ = this.isEdit()
    //   ? this.productService.update(this.productId!, this.product() as unknown as UpdateProductDTO)
    //   : this.productService.create(this.product() as CreateProductDTO);

    // request$.subscribe({
    //   next: () => {
    //     this.router.navigate(['/products']);
    //   },
    //   error: (err) => {
    //     this.error.set(err.error?.error || 'Failed to save product');
    //     this.saving.set(false);
    //   }
    // });
  }
}
