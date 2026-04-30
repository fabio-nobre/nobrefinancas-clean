import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';

import Chart from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  standalone: true,
  template: `<canvas #canvas></canvas>`
})
export class ChartComponent implements AfterViewInit, OnChanges, OnDestroy {

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  @Input() labels: string[] = [];
  @Input() data: number[] = [];

  private chart: Chart | null = null;

  // 🔥 render inicial
  ngAfterViewInit(): void {
    this.renderChart();
  }

  // 🔥 atualiza quando dados mudam
  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart && (changes['labels'] || changes['data'])) {
      this.chart.destroy();
      this.renderChart();
    }
  }

  // 🔥 evita memory leak
  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  // 🎯 método central
  private renderChart(): void {

    if (!this.canvas) return;

    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'doughnut',

      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.data,
            backgroundColor: [
              '#22c55e', // verde
              '#ef4444', // vermelho
              '#3b82f6', // azul
              '#f59e0b', // amarelo
              '#a855f7'  // roxo
            ]
          }
        ]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
}