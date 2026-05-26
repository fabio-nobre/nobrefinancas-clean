import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="bg-white rounded-2xl shadow-sm p-6"
    >
      <ng-content />
    </div>
  `
})
export class CardComponent { }