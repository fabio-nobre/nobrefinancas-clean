import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import { StatCardComponent }
  from '../../../../shared/ui/stat-card/stat-card.component';

import { CountUpComponent }
  from '../../../../shared/components/count-up/count-up.component';


import { DASHBOARD_LABELS }
  from '../../../../core/constants/dashboard.constants';

@Component({
  selector: 'app-financial-summary',
  standalone: true,
  imports: [
    CommonModule,
    StatCardComponent,
    CountUpComponent
  ],
  changeDetection:
    ChangeDetectionStrategy.OnPush,

  styleUrl:
    './financial-summary.component.css',

  template: `
 <div class="summary-grid">

  <!-- SALDO HERO -->
<div
  class="card summary-card--hero"
>

  <div class="hero-content">

    <!-- ESQUERDA -->
    <div class="hero-left">

      <div class="hero-label">
        {{ labels.cards.balance }}
      </div>

      <div class="hero-balance">
        <app-count-up
          [value]="balance">
        </app-count-up>
      </div>

      <div class="hero-growth">
        <span style="color:#4ade80;">
          ↑ {{ monthGrowth }}%
        </span>

        em relação ao mês anterior
      </div>

    </div>

    <!-- DIREITA -->
    <div class="hero-right">

      <div class="hero-metric hero-metric-income">

        <div class="hero-metric-label">
          Entradas
        </div>

        <div class="hero-metric-income-value">
          {{
            income
            | currency:'BRL'
          }}
        </div>

      </div>

      <div class="hero-metric hero-metric-expense">

        <div class="hero-metric-label">
          Saídas
        </div>

        <div class="hero-metric-expense-value">
          {{
            expenses
            | currency:'BRL'
          }}
        </div>

      </div>

    </div>

  </div>

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

  @Input()
  monthGrowth = 12.4;

  readonly labels =
    DASHBOARD_LABELS;
}