import {
  ChangeDetectionStrategy,
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
  template: `
   <div style="
    width:100%;
    height:360px;
    position:relative;
  ">
    <canvas
      #canvas
      style="
        width:100% !important;
        height:100% !important;
      ">
    </canvas>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
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

    const canvas = this.canvas.nativeElement;

    this.chart = new Chart(canvas, {
      type: 'doughnut',

      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.data,
            backgroundColor: [
              '#22c55e',
              '#ef4444',
              '#3b82f6',
              '#f59e0b',
              '#a855f7'
            ],

            borderWidth: 2,

            hoverOffset: 4
          }
        ]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        cutout: '60%',

        plugins: {
          legend: {
            display: false
          }
        }
      }
    });

  }
}