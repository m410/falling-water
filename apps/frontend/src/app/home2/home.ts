import { Component, signal } from '@angular/core';
import { Builder } from '../builder/builder';
import { PowerOutput } from '../builder/power-output';
import { SystemOptions } from '../system/system-options';

@Component({
  imports: [Builder, SystemOptions],
  templateUrl: './home.html',
})
export class Home {
  readonly showForm = signal(false);
  readonly powerOutput = signal<PowerOutput | null>(null);
  toggleForm() {
    this.showForm.update((v) => !v);
  }
  output(result: PowerOutput) {
    this.powerOutput.set(result);
  }
}
