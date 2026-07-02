import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import { DASHBOARD_LABELS }
  from '../../../../core/constants/dashboard.constants';

@Component({
  selector: 'app-monthly-summary',
  standalone: true,
  imports: [CommonModule],
  changeDetection:
    ChangeDetectionStrategy.OnPush,

  styleUrl:
    './monthly-summary.component.css',

  host: {
    style: 'display:block; width:100%;'
  },

  template: `
    <h3>
      🧠
      {{ labels.cards.monthlySummary }}
    </h3>

    <div class="summary-text">

      <div class="health-score">
        {{ scoreFinanceiro }}/100
      </div>

      <div class="health-status">
        {{ diagnosticoFinanceiro }}
      </div>

      <div class="top-category">
        <span>Principal gasto</span>

        <strong>
          {{ topCategoria }}
        </strong>
      </div>

    </div>
  `
})
export class MonthlySummaryComponent {

  @Input({ required: true })
  resumo = '';

  @Input()
  scoreFinanceiro = 0;

  @Input()
  diagnosticoFinanceiro = '';

  @Input()
  topCategoria = '';

  readonly labels =
    DASHBOARD_LABELS;
}