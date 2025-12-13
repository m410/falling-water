import { Component, signal } from '@angular/core';
import { Builder } from '../hydro-system/builder/builder';
import { PowerOutput } from '../hydro-system/builder/power-output';
import { SystemOptions } from '../hydro-system/system/system-options';

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
