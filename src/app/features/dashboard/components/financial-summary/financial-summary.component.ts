import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import { StatCardComponent }
  from '../../../../shared/ui/stat-card/stat-card.component';

import { DASHBOARD_LABELS }
  from '../../../../core/constants/dashboard.constants';

@Component({
  selector: 'app-financial-summary',
  standalone: true,
  imports: [
    CommonModule,
    StatCardComponent
  ],
  changeDetection:
    ChangeDetectionStrategy.OnPush,

  template: `
    <div
      style="
        display:grid;
        grid-template-columns:
        minmax(320px,1fr)
        minmax(320px,1fr)
        minmax(320px,1fr);
        gap:28px;
        margin-bottom:30px;
      "
    >

      <div
        class="card"
        style="
          background:#1e293b;
          border-radius:20px;
          padding:24px;
        "
      >
        <app-stat-card
          [label]="labels.cards.balance"
          [value]="
            (balance | currency:'BRL')
            ?? ''
          "
        />
      </div>

      <div
        class="card"
        style="
          background:#0f3b2e;
          border-radius:20px;
          padding:24px;
        "
      >
        <app-stat-card
          [label]="labels.cards.income"
          [value]="
            (income | currency:'BRL')
            ?? ''
          "
          variant="success"
        />
      </div>

      <div
        class="card"
        style="
          background:#3b1111;
          border-radius:20px;
          padding:24px;
        "
      >
        <app-stat-card
          [label]="labels.cards.expenses"
          [value]="
            (expenses | currency:'BRL')
            ?? ''
          "
          variant="danger"
        />
      </div>

    </div>
  `
})
export class FinancialSummaryComponent {

  @Input({ required: true })
  balance = 0;

  @Input({ required: true })
  income = 0;

  @Input({ required: true })
  expenses = 0;

  readonly labels =
    DASHBOARD_LABELS;
}