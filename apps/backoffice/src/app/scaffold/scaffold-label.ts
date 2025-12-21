import { Component, signal } from '@angular/core';
import { Field, form, required } from '@angular/forms/signals';

interface Entity {
  name: string;
  description: string | null;
}

@Component({
  selector: 'bo-scaffold-label',
  imports: [Field],
  template: `
    <h1 class="display-1 mb-3">testing</h1>
    <form (submit)="submit($event)" novalidate autocomplete="off">
      <label for="name">Name</label>
      <input id="name" type="text" [field]="form.name">
      <label for="description">Description</label>
<!--      <input id="description" type="text" [field]="form.description">-->
      <button type="submit">submit</button>
    </form>
  `
})
export class ScaffoldLabel {
  protected readonly entity = signal<Entity>({
    name: '',
    description: null
  });
  protected readonly form = form(this.entity, (path) => {
    required(path.name);
  });

  protected submit($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();
    console.log('submit', this.entity());
  }
}
