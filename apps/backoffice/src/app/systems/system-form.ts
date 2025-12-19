import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { SystemService, CreateSystemDTO, Label, SubmitButton } from '@falling-water/share';
import { ProductService, Product } from '@falling-water/share';
import { Field, form } from '@angular/forms/signals';

@Component({
  selector: 'bo-system-form',
  standalone: true,
  imports: [Field, RouterLink, Label, SubmitButton],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>{{ isEdit() ? 'Edit System' : 'New System' }}</h2>
      <a routerLink="/systems" class="btn btn-outline-secondary">
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
                    type="text"
                    class="fwe form-control"
                    id="name"
                    [field]="form.name"
                  />
                </fwe-label>

                <fwe-label [label]="'Description'">
                  <textarea
                    class="fwe form-control"
                    id="description"
                    [field]="form.description"
                    rows="3"
                  ></textarea>
                </fwe-label>

                <div class="row">
                  <div class="col-md-6">
                    <fwe-label [label]="'Min flow rate'">
                      <input
                        type="number"
                        class="fwe form-control"
                        id="minFlowRate"
                        [field]="form.min_flow_rate_cms"
                      />
                    </fwe-label>
                  </div>
                  <div class="col-md-6">
                    <fwe-label [label]="'Max flow rate'">
                      <input
                        type="number"
                        class="fwe form-control"
                        id="maxFlowRate"
                        [field]="form.max_flow_rate_cms"
                        step="0.01"
                      />
                    </fwe-label>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <fwe-label [label]="'Min head'">
                      <input
                        type="number"
                        class="fwe form-control"
                        id="minHead"
                        [field]="form.min_head_mt"
                        step="0.01"
                      />
                    </fwe-label>
                  </div>
                  <div class="col-md-6">
                    <fwe-label [label]="'Max head'">
                      <input
                        type="number"
                        class="fwe form-control"
                        id="maxHead"
                        [field]="form.max_head_mt"
                        step="0.01"
                      />
                    </fwe-label>
                  </div>
                </div>

                <fwe-label [label]="'Status'">
                  <select
                    class="fwe form-select"
                    id="status"
                    [field]="form.status"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </fwe-label>
              </div>

              <div class="col-md-4">
                <div class="card">
                  <div class="card-header">Associated Products</div>
                  <!--  todo convert to typeahead -->
                  <div class="card-body" style="max-height: 400px; overflow-y: auto;">
                    @for (product of products(); track product.id) {
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          [id]="'product_' + product.id"
                          [checked]="selectedProductIds().includes(product.id)"
                          (change)="toggleProduct(product.id)"
                        />
                        <label
                          class="form-check-label"
                          [for]="'product_' + product.id"
                        >
                          {{ product.name }}
                        </label>
                      </div>
                    } @empty {
                      <p class="text-muted mb-0">No products available</p>
                    }
                  </div>
                </div>
              </div>
            </div>

            <fwe-submit-button
              [disabled]="form().invalid()"
              [saving]="saving()"
              [isEdit]="isEdit()"
              [entityName]="'System'"
              [cancelRoute]="'/systems'"
            />
          </form>
        </div>
      </div>
    }
  `,
})
export class SystemForm implements OnInit {
  private readonly systemService = inject(SystemService);
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected selectedProductIds = signal<number[]>([]);

  protected isEdit = signal(false);
  protected loading = signal(false);
  protected saving = signal(false);
  protected error = signal<string | null>(null);
  protected products = signal<Product[]>([]);
  protected systemId: number | null = null;

  protected readonly system = signal<CreateSystemDTO>({
    name : '',
    description : '',
    min_flow_rate_cms: 0 ,
    max_flow_rate_cms:  0 ,
    min_head_mt:  0 ,
    max_head_mt:  0 ,
    status : '',
  });

  protected form = form(this.system)

  ngOnInit(): void {
    this.loadProducts();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.systemId = parseInt(idParam, 10);
      this.isEdit.set(true);
      this.loadSystem();
    }
  }

  private loadProducts(): void {
    this.productService.findAll().subscribe({
      next: (data) => this.products.set(data),
      error: () => {},
    });
  }

  private loadSystem(): void {
    if (!this.systemId) return;

    this.loading.set(true);
    this.systemService.findById(this.systemId).subscribe({
      next: (system) => {
        // this.name = system.name;
        // this.description = system.description;
        // this.minFlowRate = system.min_flow_rate_cms;
        // this.maxFlowRate = system.max_flow_rate_cms;
        // this.minHead = system.min_head_mt;
        // this.maxHead = system.max_head_mt;
        // this.status = system.status;
        this.selectedProductIds.set(system.product_ids || []);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Failed to load system');
        this.loading.set(false);
      },
    });
  }

  protected toggleProduct(productId: number): void {
    this.selectedProductIds.update((ids) => {
      if (ids.includes(productId)) {
        return ids.filter((id) => id !== productId);
      } else {
        return [...ids, productId];
      }
    });
  }

  protected onSubmit($event: Event): void {
    $event.stopPropagation();
    $event.preventDefault();

    // todo mark as touched

    this.saving.set(true);
    this.error.set(null);


    const request$ = this.isEdit()
      ? this.systemService.update(this.systemId!, this.system())
      : this.systemService.create(this.system());

    request$.subscribe({
      next: () => {
        this.router.navigate(['/systems']);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Failed to save system');
        this.saving.set(false);
      },
    });
  }
}
