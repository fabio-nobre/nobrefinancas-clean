import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { ChartComponent } from '../../../../shared/components/chart/chart.component';

@Component({
  selector: 'app-chart-section',
  standalone: true,
  imports: [
    CommonModule,
    ChartComponent
  ],
  styleUrls: ['./chart-section.component.css'],
  templateUrl: './chart-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartSectionComponent {

  @Input() receitas = 0;

  @Input() despesas = 0;

  @Input() etiquettes: string[] = [];

  @Input() data: number[] = [];

}