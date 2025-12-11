import { DecimalPipe } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  Renderer2,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-system-options',
  imports: [DecimalPipe],
  templateUrl: './system-options.html',
  standalone: true,
})
export class SystemOptions {
  private readonly scrollAmount = 300;
  private readonly renderer = inject(Renderer2);
  readonly estimatedPower = input.required<number>();

  readonly container = viewChild<ElementRef>('cardScroll');
  readonly leftBtn = viewChild<ElementRef>('scrollLeft');
  readonly rightBtn = viewChild<ElementRef>('scrollRight');

  constructor() {
    effect(() => {
      if (this.leftBtn()) {
        this.renderer.listen(this.leftBtn()?.nativeElement, 'click', () => {
          this.container()?.nativeElement.scrollBy({
            left: -this.scrollAmount,
            behavior: 'smooth',
          });
        });
      }
    });
    effect(() => {
      if (this.rightBtn())
        this.renderer.listen(this.rightBtn()?.nativeElement, 'click', () => {
          this.container()?.nativeElement.scrollBy({
            left: this.scrollAmount,
            behavior: 'smooth',
          });
        });
    });
  }
}
