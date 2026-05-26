import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ title }}
      </h1>

      @if (subtitle) {
        <p class="text-gray-500 mt-1">
          {{ subtitle }}
        </p>
      }
    </div>
  `
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle?: string;
}