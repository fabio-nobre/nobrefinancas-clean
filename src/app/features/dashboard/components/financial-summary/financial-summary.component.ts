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
  class="card summary-card--hero"
  style="
    grid-column:
    1 / span 2;

    background:
    linear-gradient(
      135deg,
      rgba(109,40,217,.18),
      rgba(15,23,42,.96)
    );

    border-radius:36px;

    padding:28px 32px;

    border:
    1px solid
    rgba(124,58,237,.18);

    min-height:210px;

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

  <div style="
    width:100%;
    display:flex;
    justify-content:space-between;
    align-items:flex-end;
    gap:32px;
  ">

    <!-- ESQUERDA -->
    <div>

      <div style="
        color:#a78bfa;
        font-size:13px;
        font-weight:700;
        text-transform:uppercase;
        letter-spacing:.12em;
        margin-bottom:14px;
      ">
        {{ labels.cards.balance }}
      </div>

      <div style="
        font-size:58px;
        font-weight:800;
        color:white;
        line-height:1;
        margin-bottom:16px;
      ">
        <app-count-up
          [value]="balance">
        </app-count-up>
      </div>

      <div style="
        display:flex;
        align-items:center;
        gap:10px;
        color:#cbd5e1;
        font-size:15px;
        font-weight:600;
      ">
        <span style="color:#4ade80;">
          ↑ {{ monthGrowth }}%
        </span>

        em relação ao mês anterior
      </div>

    </div>

    <!-- DIREITA -->
    <div style="
      display:flex;
      flex-direction:column;
      gap:16px;
      min-width:220px;
    ">

      <div style="
        padding:18px;
        border-radius:22px;

        display:flex;
        flex-direction:column;
        justify-content:center;
        background:
        rgba(255,255,255,.05);
        border:
        1px solid
        rgba(255,255,255,.04);
      ">

        <div style="
          color:#94a3b8;
          font-size:13px;
          margin-bottom:6px;
        ">
          Entradas
        </div>

        <div style="
          color:#22c55e;
          font-size:22px;
          font-weight:700;
        ">
          {{
            income
            | currency:'BRL'
          }}
        </div>

      </div>

      <div style="
        padding:14px 18px;
        border-radius:18px;
        background:
        rgba(255,255,255,.05);
        border:
        1px solid
        rgba(255,255,255,.04);
      ">

        <div style="
          color:#94a3b8;
          font-size:13px;
          margin-bottom:6px;
        ">
          Saídas
        </div>

        <div style="
          color:#ef4444;
          font-size:26px;
          font-weight:700;
        ">
          {{
            expenses
            | currency:'BRL'
          }}
        </div>

      </div>

    </div>

  </div>

</div>

    <!-- RECEITAS -->
    <div
      class="card summary-card--income"
      style="
        background:
        linear-gradient(
          180deg,
          rgba(16,185,129,.12),
          rgba(15,23,42,.96)
        );

        border-radius:30px;

        padding:24px 28px;

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


     <div class="stat-card-premium">

      <p>
        {{ labels.cards.income }}
      </p>

      <div style="
        color:#22c55e;
        font-size:48px;
        font-weight:700;
      ">
        <app-count-up
          [value]="income">
        </app-count-up>
      </div>

    </div>

    </div>

    <!-- DESPESAS -->
    <div
      class="card summary-card--expense"
      style="
        background:
        linear-gradient(
          180deg,
          rgba(239,68,68,.12),
          rgba(15,23,42,.96)
        );

        border-radius:30px;

        padding:24px 28px;

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

    <div class="stat-card-premium">

      <p>
        {{ labels.cards.expenses }}
      </p>

      <div style="
        color:#ef4444;
        font-size:48px;
        font-weight:700;
      ">
        <app-count-up
          [value]="expenses">
        </app-count-up>
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