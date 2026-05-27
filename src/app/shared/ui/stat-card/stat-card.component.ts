import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="
        rounded-3xl
        bg-slate-800/70
        p-6
        h-full
        min-h-[160px]
        flex
        flex-col
        justify-center
      "
    >
      <p class="text-sm text-slate-300 font-medium">
        {{ label }}
      </p>

      <h2
        class="
          text-4xl
          font-bold
          mt-4
          text-white
        " style="font-size:48px;
        font-weight:700;"
      >
        {{ value }}
      </h2>
    </div>
  `
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value = '';
}