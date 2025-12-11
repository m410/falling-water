import { Component, signal } from '@angular/core';
import { Builder } from '../builder/builder';

@Component({
  imports: [Builder],
  templateUrl: './home.html',
})
export class Home {
  readonly showForm = signal(false);

  toggleForm() {
    this.showForm.update((v) => !v);
  }
}
