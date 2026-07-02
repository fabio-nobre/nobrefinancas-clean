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

      <strong>
        {{ diagnosticoFinanceiro }}
      </strong>

      <br><br>

      Score:
      {{ scoreFinanceiro }}/100

      <br><br>

      {{ resumo }}

      <br><br>

      Principal gasto:

      <strong>
        {{ topCategoria }}
      </strong>

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