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
      class="bg-white rounded-2xl shadow-sm p-6"
    >
      <p class="text-sm text-gray-500">
        {{ label }}
      </p>

      <h2
        class="text-2xl font-bold mt-2"
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