import { Component, OnInit } from '@angular/core';
import { MockDataService } from '../../core/services/mock-data.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { TransactionService } from '../../core/services/transaction.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartComponent, CommonModule],
  template: `
    <div class="space-y-6">

      <h1 class="text-2xl font-bold">Dashboard</h1>

      <div
        class="p-3 rounded-xl text-sm font-semibold"
        [class.bg-green-100]="status === 'positivo'"
        [class.text-green-700]="status === 'positivo'"
        [class.bg-red-100]="status === 'negativo'"
        [class.text-red-700]="status === 'negativo'"
        [class.bg-gray-100]="status === 'neutro'"
        [class.text-gray-700]="status === 'neutro'"
      >
        {{ status === 'positivo' ? 'Situação positiva 👍' :
          status === 'negativo' ? 'Atenção aos gastos ⚠️' :
          'Equilibrado' }}
      </div>

      <div class="flex items-center gap-2">

        <button (click)="mesAnterior()" class="px-2 py-1 bg-gray-200 rounded">
          ◀
        </button>

        <span class="font-semibold">
          {{ dataAtual | date:'MMMM yyyy' }}
        </span>

        <button (click)="proximoMes()" class="px-2 py-1 bg-gray-200 rounded">
          ▶
        </button>

      </div>

      <!-- CARDS -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div class="bg-white p-5 rounded-2xl shadow">
          <p class="text-gray-500">Saldo</p>
          <h2 class="text-2xl font-bold text-blue-600">
            R$ {{ saldo | number:'1.2-2' }}
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

      <!-- GRÁFICO -->
      <div class="bg-white p-5 rounded-2xl shadow">

        <h3 class="font-semibold mb-4">
          Gastos por categoria
        </h3>

        <div class="h-[300px] max-w-[400px] mx-auto">
          <app-chart
            [labels]="labels"
            [data]="valores"
          ></app-chart>
        </div>

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

  dataAtual = new Date();

  status: 'positivo' | 'negativo' | 'neutro' = 'neutro';

  constructor(
    // private mock: MockDataService,
    private transactionsService: TransactionService,
    private dashboard: DashboardService
  ) { }

  ngOnInit() {
    this.transactionsService.transactions$.subscribe(data => {

      const filtradas = this.transactionsService.filtrarPorMes(data, this.dataAtual);

      this.saldo = this.dashboard.calcularSaldo(filtradas);
      this.entradas = this.dashboard.calcularEntradas(filtradas);
      this.saidas = this.dashboard.calcularSaidas(filtradas);

      const grafico = this.dashboard.getGastosPorCategoria(filtradas);

      this.labels = grafico.labels;
      this.valores = grafico.valores;
    });
  }

  mesAnterior() {
    this.dataAtual = new Date(
      this.dataAtual.getFullYear(),
      this.dataAtual.getMonth() - 1,
      1
    );

    this.recalcular();
  }

  proximoMes() {
    this.dataAtual = new Date(
      this.dataAtual.getFullYear(),
      this.dataAtual.getMonth() + 1,
      1
    );

    this.recalcular();
  }

  recalcular() {
    const data = this.transactionsService.getAll();

    const filtradas = this.transactionsService.filtrarPorMes(data, this.dataAtual);

    this.saldo = this.dashboard.calcularSaldo(filtradas);
    if (this.saldo > 0) {
      this.status = 'positivo';
    } else if (this.saldo < 0) {
      this.status = 'negativo';
    } else {
      this.status = 'neutro';
    }

    this.entradas = this.dashboard.calcularEntradas(filtradas);
    this.saidas = this.dashboard.calcularSaidas(filtradas);

    const grafico = this.dashboard.getGastosPorCategoria(filtradas);

    this.labels = grafico.labels;
    this.valores = grafico.valores;
  }
}