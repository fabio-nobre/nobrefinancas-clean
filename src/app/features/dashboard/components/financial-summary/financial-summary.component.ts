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
  <div style="
    display:grid;
    grid-template-columns:
      1fr 1fr;
    gap:28px;
    width:100%;
    margin-bottom:42px;
  ">

    <!-- SALDO HERO -->
    <div
      class="card"
      style="
        grid-column:1 / -1;

        background:
        linear-gradient(
          135deg,
          rgba(109,40,217,.18),
          rgba(15,23,42,.96)
        );

        border-radius:36px;

        padding:34px;

        border:
        1px solid
        rgba(124,58,237,.18);

        min-height:180px;

        display:flex;
        align-items:center;

        box-shadow:
          0 14px 42px
          rgba(0,0,0,.26);

        transition:
          transform .2s ease,
          box-shadow .2s ease;
      "

      onmouseover="
      this.style.transform='translateY(-3px)';
      this.style.boxShadow='0 24px 50px rgba(0,0,0,.32)';
      "

      onmouseout="
      this.style.transform='translateY(0)';
      this.style.boxShadow='0 14px 42px rgba(0,0,0,.26)';
      "
    >

      <div>

        <div style="
          color:#a78bfa;
          font-size:13px;
          font-weight:700;
          text-transform:uppercase;
          letter-spacing:.12em;
          margin-bottom:12px;
        ">
          {{ labels.cards.balance }}
        </div>

        <div style="
          font-size:56px;
          font-weight:800;
          color:white;
          line-height:1;
        ">
          {{
            balance
            | currency:'BRL'
          }}
        </div>

      </div>

    </div>

    <!-- RECEITAS -->
    <div
      class="card"
      style="
        background:
        linear-gradient(
          180deg,
          rgba(16,185,129,.12),
          rgba(15,23,42,.96)
        );

        border-radius:30px;

        padding:28px;

        border:
        1px solid
        rgba(16,185,129,.10);

        min-height:170px;

        box-shadow:
          0 14px 42px
          rgba(0,0,0,.22);

        transition:
          transform .2s ease;
      "

      onmouseover="
      this.style.transform='translateY(-3px)';
      "

      onmouseout="
      this.style.transform='translateY(0)';
      "
    >

      <app-stat-card
        [label]="labels.cards.income"
        [value]="
          (income
          | currency:'BRL')
          ?? ''
        "
        variant="success"
      />

    </div>

    <!-- DESPESAS -->
    <div
      class="card"
      style="
        background:
        linear-gradient(
          180deg,
          rgba(239,68,68,.12),
          rgba(15,23,42,.96)
        );

        border-radius:30px;

        padding:28px;

        border:
        1px solid
        rgba(239,68,68,.10);

        min-height:170px;

        box-shadow:
          0 14px 42px
          rgba(0,0,0,.22);

        transition:
          transform .2s ease;
      "

      onmouseover="
      this.style.transform='translateY(-3px)';
      "

      onmouseout="
      this.style.transform='translateY(0)';
      "
    >

      <app-stat-card
        [label]="labels.cards.expenses"
        [value]="
          (expenses
          | currency:'BRL')
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