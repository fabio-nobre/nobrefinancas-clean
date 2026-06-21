import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-count-up',
  standalone: true,
  imports: [CommonModule],
  template: `
  {{
    displayValue
    | currency:'BRL'
  }}
  `
})
export class CountUpComponent
  implements OnChanges {

  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  @Input()
  value = 0;

  displayValue = 0;


  ngOnChanges(changes: SimpleChanges): void {

    if (changes['value']) {
      this.animate();
    }
  }


  private animate(): void {

    const end = this.value;

    const duration = 1200;

    const startTime = performance.now();

    const step = (currentTime: number) => {

      const elapsed =
        currentTime - startTime;

      const progress =
        Math.min(elapsed / duration, 1);

      this.displayValue =
        Math.round(end * progress);

      this.cdr.detectChanges();

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    this.displayValue = 0;

    requestAnimationFrame(step);
  }
}