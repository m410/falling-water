import { Component, computed, contentChild, effect, input, signal } from '@angular/core';
import { Field } from '@angular/forms/signals';

@Component({
  selector: 'fwe-label',
  template: `
    <div class="mb-3 form-floating">
      <ng-content></ng-content>
      <label class="form-label" for="{{id()}}">{{ label() }}</label>

      @if (!state()?.valid() && state()?.touched()) {
        @for (error of state()?.errors(); track error.kind; let idx = $index) {
          @if (idx > 0) {
            <span>, </span>
          }
          <span class="invalid-feedback">{{error.kind}}</span>
        }
      }
    </div>
`
})
export class Label {
  readonly label = input.required<string>()
  protected readonly field = contentChild(Field);
  protected readonly form = input('');

  protected readonly id = signal('')

  protected readonly state = computed(() => this.field()?.state())

  constructor() {
    effect(() => {
      if(this.state()?.touched()){
        const elem = this.field()?.element;

        if(this.state()?.valid()){
          elem?.classList.remove('is-invalid');
          elem?.classList.add('is-valid');
        } else {
          elem?.classList.remove('is-valid');
          elem?.classList.add('is-invalid');
        }
      }
    })
    effect(() => {
      if(this.field()) {
        const elem = this.field()?.element;
        if(elem) {
          this.id.set(elem.id)
          if(elem instanceof HTMLSelectElement){
            elem.classList.add('fwe', 'form-select');
          } else {
            elem.classList.add('fwe','form-control');
          }
        }
      }
    })
  }
}
