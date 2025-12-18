import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'fwe-submit-button',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="d-flex gap-2 mt-3">
      <button
        type="submit"
        class="btn btn-primary"
        [disabled]="disabled() || saving()"
      >
        @if (saving()) {
          <span class="spinner-border spinner-border-sm me-1"></span>
        }
        {{ isEdit() ? 'Update' : 'Create' }} {{ entityName() }}
      </button>
      <a [routerLink]="cancelRoute()" class="btn btn-outline-secondary">
        Cancel
      </a>
    </div>
  `,
})
export class SubmitButton {
  readonly disabled = input(false);
  readonly saving = input(false);
  readonly isEdit = input(false);
  readonly entityName = input.required<string>();
  readonly cancelRoute = input.required<string>();
}
