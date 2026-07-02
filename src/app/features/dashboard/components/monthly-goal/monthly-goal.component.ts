import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { FormsModule }
  from '@angular/forms';

import { DASHBOARD_LABELS }
  from '../../../../core/constants/dashboard.constants';

@Component({
  selector: 'app-monthly-goal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  changeDetection:
    ChangeDetectionStrategy.OnPush,

  styleUrl:
    './monthly-goal.component.css',


  host: {
    style: 'display:block; width:100%;'
  },

  template: `
      <h3>
        🎯
        {{ labels.cards.monthlyGoal }}
      </h3>

      <div class="goal-percent">
        {{ percentualExibicao | number:'1.0-0' }}%
      </div>

      <div class="goal-status">
        {{ statusMeta }}
      </div>

      <input
        type="number"
        [ngModel]="metaMensal"
        (input)="onInput($event)"
        style="
          width:100%;
          padding:12px;
          border-radius:10px;
          border:none;
          margin-top:12px;
        "
      />

    <div class="goal-values">

      <div>
        <span>Gasto</span>

        <strong>
          {{
            gastoTotal
            | currency:'BRL'
          }}
        </strong>
      </div>

      <div>
        <span>Meta</span>

        <strong>
          {{
            metaMensal
            | currency:'BRL'
          }}
        </strong>
      </div>

    </div>

      <div
        style="
          height:10px;
          background:#374151;
          border-radius:999px;
          margin-top:12px;
        "
      >
        <div
          [style.width.%]="
            percentualMeta > 100
              ? 100
              : percentualMeta
          "
          style="
            height:100%;
            background:#22c55e;
            border-radius:999px;
          "
        >
        </div>
      </div>
  `
})
export class MonthlyGoalComponent {

  @Input({ required: true })
  metaMensal = 0;

  @Input({ required: true })
  gastoTotal = 0;

  @Input({ required: true })
  percentualMeta = 0;

  @Output()
  metaMensalChange =
    new EventEmitter<number>();


  readonly labels =
    DASHBOARD_LABELS;

  onInput(event: Event): void {

    const target =
      event.target as HTMLInputElement | null;

    const value =
      Number(target?.value ?? 0);

    this.metaMensal =
      value;

    this.metaMensalChange
      .emit(value);
  }

  get statusMeta(): string {

    if (!this.metaMensal) {
      return 'Defina uma meta';
    }

    if (this.percentualMeta <= 80) {
      return 'Dentro da meta';
    }

    if (this.percentualMeta <= 100) {
      return 'Próximo do limite';
    }

    return 'Meta ultrapassada';
  }

  get percentualExibicao(): number {

    return Math.min(
      this.percentualMeta,
      999
    );
  }

}