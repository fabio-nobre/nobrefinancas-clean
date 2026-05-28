import { CommonModule, KeyValue } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import { DASHBOARD_LABELS }
  from '../../../../core/constants/dashboard.constants';

@Component({
  selector: 'app-account-summary',
  standalone: true,
  imports: [CommonModule],
  changeDetection:
    ChangeDetectionStrategy.OnPush,

  template: `
    <div
      class="card"
      style="
        background:#1e293b;
        padding:40px;
        border-radius:28px;
        box-shadow:
          0 10px 30px
          rgba(0,0,0,.18);
      "
    >
      <h3>
        💳
        {{ labels.cards.accounts }}
      </h3>

      <div
        *ngFor="
          let conta of saldoPorConta
          | keyvalue;
          trackBy: trackByConta
        "
        style="margin-top:10px;"
      >
        <strong>
          {{ conta.key }}
        </strong>

        <br>

        {{
          conta.value
          | currency:'BRL'
        }}
      </div>
    </div>
  `
})
export class AccountSummaryComponent {

  @Input({ required: true })
  saldoPorConta:
    Record<string, number> = {};

  readonly labels =
    DASHBOARD_LABELS;

  trackByConta(
    index: number,
    item: KeyValue<string, number>
  ): string {
    return item.key;
  }
}