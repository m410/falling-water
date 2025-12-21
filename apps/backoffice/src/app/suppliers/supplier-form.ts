import { Component, inject, signal, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { SupplierService, Label, SubmitButton } from '@falling-water/share';
import { Field, form, required } from '@angular/forms/signals';

interface SupplierFormData {
  name: string;
  email: string;
  phone: string;
  website: string;
  notes: string;
}

@Component({
  selector: 'bo-supplier-form',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [Field, RouterLink, Label, SubmitButton],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="display-1 mb-3">{{ isEdit() ? 'Edit Supplier' : 'New Supplier' }}</h1>
      <a routerLink="/suppliers" class="btn btn-outline-secondary">
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
              <div class="col-md-6">
                <fwe-label [label]="'Name'">
                  <input
                    type="text"
                    class="fwe form-control"
                    id="name"
                    [field]="supplierForm.name"
                  />
                </fwe-label>
              </div>
              <div class="col-md-6">
                <fwe-label [label]="'Email'">
                  <input
                    type="email"
                    class="fwe form-control"
                    id="email"
                    [field]="supplierForm.email"
                  />
                </fwe-label>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <fwe-label [label]="'Phone'">
                  <input
                    type="tel"
                    class="fwe form-control"
                    id="phone"
                    [field]="supplierForm.phone"
                  />
                </fwe-label>
              </div>
              <div class="col-md-6">
                <fwe-label [label]="'Website'">
                  <input
                    type="url"
                    class="fwe form-control"
                    id="website"
                    [field]="supplierForm.website"
                    placeholder="https://"
                  />
                </fwe-label>
              </div>
            </div>

            <fwe-label [label]="'Notes'">
              <textarea
                class="fwe form-control"
                id="notes"
                [field]="supplierForm.notes"
                rows="4"
              ></textarea>
            </fwe-label>

            <fwe-submit-button
              [disabled]="supplierForm().invalid()"
              [saving]="saving()"
              [isEdit]="isEdit()"
              [entityName]="'Supplier'"
              [cancelRoute]="'/suppliers'"
            />
          </form>
        </div>
      </div>
    }
  `,
})
export class SupplierForm implements OnInit {
  private readonly supplierService = inject(SupplierService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected isEdit = signal(false);
  protected loading = signal(false);
  protected saving = signal(false);
  protected error = signal<string | null>(null);
  protected supplierId: number | null = null;

  protected readonly supplier = signal<SupplierFormData>({
    name: '',
    email: '',
    phone: '',
    website: '',
    notes: '',
  });

  protected supplierForm = form(this.supplier, (path) => {
    required(path.name);
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.supplierId = parseInt(idParam, 10);
      this.isEdit.set(true);
      this.loadSupplier();
    }
  }

  private loadSupplier(): void {
    if (!this.supplierId) return;

    this.loading.set(true);
    this.supplierService.findById(this.supplierId).subscribe({
      next: (supplier) => {
        this.supplier.set({
          name: supplier.name,
          email: supplier.email || '',
          phone: supplier.phone || '',
          website: supplier.website || '',
          notes: supplier.notes || '',
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Failed to load supplier');
        this.loading.set(false);
      },
    });
  }

  protected onSubmit($event: Event): void {
    $event.stopPropagation();
    $event.preventDefault();

    this.saving.set(true);
    this.error.set(null);

    const request$ = this.isEdit()
      ? this.supplierService.update(this.supplierId!, this.supplier())
      : this.supplierService.create(this.supplier());

    request$.subscribe({
      next: () => {
        this.router.navigate(['/suppliers']);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Failed to save supplier');
        this.saving.set(false);
      },
    });
  }
}
