import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { ChartComponent }
  from '../../../../shared/components/chart/chart.component';

@Component({
  selector: 'app-chart-section',
  standalone: true,
  imports: [
    CommonModule,
    ChartComponent
  ],
  styleUrls: [
    './chart-section.component.css'
  ],
  templateUrl:
    './chart-section.component.html',
  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class ChartSectionComponent {

  @Input()
  etiquettes: string[] = [];

  @Input()
  data: number[] = [];

  get hasData(): boolean {

    return this.data.some(
      value => value > 0
    );
  }

 get legendItems() {
  const total = this.data.reduce(
    (sum, value) => sum + value,
    0
  );

  if (total <= 0) {
    return [];
  }

  const items = this.data.map((value, index) => {
    const percentualExato = (value / total) * 100;
    const percentualBase = Math.floor(percentualExato);

    return {
      label: this.etiquettes[index],
      value,
      percent: percentualBase,
      resto: percentualExato - percentualBase
    };
  });

  let pontosRestantes =
    100 - items.reduce(
      (sum, item) => sum + item.percent,
      0
    );

  const ordemAjuste = items
    .map((item, index) => ({
      index,
      resto: item.resto
    }))
    .sort((a, b) => b.resto - a.resto);

  for (let i = 0; i < pontosRestantes; i++) {
    const item = ordemAjuste[i];

    if (item) {
      items[item.index].percent++;
    }
  }

  return items.map(({ label, value, percent }) => ({
    label,
    value,
    percent
  }));
}

}