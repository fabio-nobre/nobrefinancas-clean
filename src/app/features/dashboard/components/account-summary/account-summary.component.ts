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

  host: {
    style: 'display:block; width:100%;'
  },

  template: `
      <h3>
        💳
        {{ labels.cards.accounts }}
      </h3>

      <div class="account-text">
        {{
          saldoTotal
          | currency:'BRL'
        }}
      </div>

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
  `
})
export class AccountSummaryComponent {

  @Input({ required: true })
  saldoPorConta:
    Record<string, number> = {};

  readonly labels =
    DASHBOARD_LABELS;

  get saldoTotal(): number {

    return Object.values(
      this.saldoPorConta
    ).reduce(
      (total, valor) => total + valor,
      0
    );
  }

  trackByConta(
    index: number,
    item: KeyValue<string, number>
  ): string {
    return item.key;
  }


}