import { Component, OnInit } from '@angular/core';
import { MockDataService } from '../../core/services/mock-data.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { TransactionService } from '../../core/services/transaction.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartComponent],
  template: `
    <div class="p-6 space-y-6">

      <h1 class="text-xl font-bold">Dashboard</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div class="bg-white p-5 rounded-2xl shadow">
          <p class="text-gray-500">Saldo</p>
          <h2 class="text-2xl font-bold text-blue-600">
            R$ {{ saldo }}
          </h2>
        </div>

        <div class="bg-green-100 p-5 rounded-2xl">
          <p>Entradas</p>
          <h2 class="text-xl font-bold text-green-700">
            R$ {{ entradas }}
          </h2>
        </div>

        <div class="bg-red-100 p-5 rounded-2xl">
          <p>Saídas</p>
          <h2 class="text-xl font-bold text-red-700">
            R$ {{ saidas }}
          </h2>
        </div>

      </div>

      <div class="bg-white p-4 rounded-xl shadow">
        <h3 class="mb-2 font-semibold">Gastos por categoria</h3>
        <!-- <div class="h-[300px] max-w-[400px] mx-auto">
          <app-chart
            [labels]="labels"
            [data]="valores"
          ></app-chart>
        </div> -->
        <div class="h-[300px] w-[300px] mx-auto">
          <app-chart
            [labels]="labels"
            [data]="valores">
          </app-chart>
      </div>

    </div>
  `
})
export class DashboardComponent implements OnInit {

  saldo = 0;
  entradas = 0;
  saidas = 0;

  labels: string[] = [];
  valores: number[] = [];

  constructor(
    // private mock: MockDataService,
    private transactionsService: TransactionService,
    private dashboard: DashboardService
  ) { }

  ngOnInit() {
    this.transactionsService.transactions$.subscribe(data => {

      console.log('🔥 REACTIVE DATA:', data);

      this.saldo = this.dashboard.calcularSaldo(data);
      this.entradas = this.dashboard.calcularEntradas(data);
      this.saidas = this.dashboard.calcularSaidas(data);

      const grafico = this.dashboard.getGastosPorCategoria(data);

      this.labels = grafico.labels;
      this.valores = grafico.valores;
    });
  }
}