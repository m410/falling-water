import { Component, signal, ViewEncapsulation } from '@angular/core';
import { Builder } from '../hydro-system/builder/builder';
import { PowerOutput } from '../hydro-system/builder/power-output';
import { SystemOptions } from '../hydro-system/system/system-options';

@Component({
  imports: [Builder, SystemOptions],
  templateUrl: './home.html',
  encapsulation: ViewEncapsulation.None,
  styles: `
    .intro-section {
      transition: opacity 0.4s ease-out, transform 0.4s ease-out, max-height 0.5s ease-out;
      max-height: 1000px;
      overflow: hidden;
    }
    .intro-section.hiding {
      opacity: 0;
      transform: translateY(-20px);
      max-height: 0;
      margin: 0;
      padding: 0;
    }
    .builder-section {
      animation: slideIn 0.5s ease-out forwards;
    }
    .system-options-section {
      animation: slideIn 0.5s ease-out forwards;
    }
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
})
export class Home {
  readonly showForm = signal(false);
  readonly hideIntro = signal(false);
  readonly powerOutput = signal<PowerOutput | null>(null);

  toggleForm() {
    if (!this.showForm()) {
      this.hideIntro.set(true);
      setTimeout(() => {
        this.showForm.set(true);
      }, 400);
    } else {
      this.showForm.set(false);
      this.hideIntro.set(false);
    }
  }

  output(result: PowerOutput) {
    this.powerOutput.set(result);
  }
}
