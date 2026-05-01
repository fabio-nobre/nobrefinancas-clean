import { Component, OnInit } from '@angular/core';
import { MockDataService } from '../../core/services/mock-data.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { TransactionService } from '../../core/services/transaction.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartComponent, CommonModule, FormsModule],
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
          {{ dataAtual | date:'MMM yyyy':'':'pt-BR' }}
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
            R$ {{ saldo | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
          </h2>
        </div>

        <div class="bg-green-100 p-5 rounded-2xl">
          <p>Entradas</p>
          <h2 class="text-xl font-bold text-green-700">
            R$ {{ entradas| currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
          </h2>
        </div>

        <div class="bg-red-100 p-5 rounded-2xl">
          <p>Saídas</p>
          <h2 class="text-xl font-bold text-red-700">
            R$ {{ saidas | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
          </h2>
        </div>

      </div>

      <div class="flex gap-2 items-center">

        <label class="text-sm font-semibold">Categoria:</label>

        <select
          [(ngModel)]="categoriaSelecionada"
          (change)="recalcular()"
          class="border p-2 rounded"
        >

          <option [ngValue]="null">Todas</option>

          <option *ngFor="let c of categorias" [value]="c">
            {{ c }}
          </option>

        </select>

      </div>

      <div class="bg-white p-5 rounded-2xl shadow space-y-3">

        <div class="flex justify-between items-center">
          <h3 class="font-semibold">Meta mensal</h3>

          <input
            type="number"
            [(ngModel)]="metaMensal"
            (change)="salvarMeta()"
            placeholder="Definir meta"
            class="border p-2 rounded w-32"
          />
        </div>

        <div class="text-sm text-gray-500">
          {{ gastoTotal | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
          de
          {{ metaMensal | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
        </div>

        <!-- BARRA -->
        <div class="w-full bg-gray-200 rounded h-3 overflow-hidden">

          <div
            class="h-3 transition-all"
            [style.width.%]="percentualMeta"
            [class.bg-green-500]="percentualMeta < 70"
            [class.bg-yellow-500]="percentualMeta >= 70 && percentualMeta < 100"
            [class.bg-red-500]="percentualMeta >= 100"
          ></div>

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

  categoriaSelecionada: string | null = null;
  categorias: string[] = [];

  metaMensal = 0;

  gastoTotal = 0;

  constructor(
    // private mock: MockDataService,
    private transactionsService: TransactionService,
    private dashboard: DashboardService
  ) { }

  ngOnInit() {

    const mesSalvo = localStorage.getItem('filtro_mes');
    if (mesSalvo) {
      this.dataAtual = new Date(mesSalvo);
    }

    const categoriaSalva = localStorage.getItem('filtro_categoria');
    if (categoriaSalva) {
      this.categoriaSelecionada = categoriaSalva;
    }

    const metaSalva = localStorage.getItem('meta_mensal');
    if (metaSalva) {
      this.metaMensal = Number(metaSalva);
    }

    this.transactionsService.transactions$.subscribe(data => {

      // 🔹 filtro por mês
      const porMes = this.transactionsService.filtrarPorMes(
        data,
        this.dataAtual
      );

      // 🔹 filtro por categoria
      const filtradas = this.dashboard.filtrarPorCategoria(
        porMes,
        this.categoriaSelecionada
      );

      // 🔹 cálculos
      this.saldo = this.dashboard.calcularSaldo(filtradas);
      this.entradas = this.dashboard.calcularEntradas(filtradas);
      this.saidas = this.dashboard.calcularSaidas(filtradas);

      // 🔹 gráfico
      const grafico = this.dashboard.getGastosPorCategoria(filtradas);

      this.labels = grafico.labels;
      this.valores = grafico.valores;

      // 🔹 categorias disponíveis
      this.categorias = [...new Set(data.map(t => t.categoria))];

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

    const porMes = this.transactionsService.filtrarPorMes(data, this.dataAtual);

    const filtradas = this.dashboard.filtrarPorCategoria(
      porMes,
      this.categoriaSelecionada
    );

    this.saldo = this.dashboard.calcularSaldo(filtradas);
    this.entradas = this.dashboard.calcularEntradas(filtradas);
    this.saidas = this.dashboard.calcularSaidas(filtradas);

    const grafico = this.dashboard.getGastosPorCategoria(filtradas);

    this.labels = grafico.labels;
    this.valores = grafico.valores;

    this.gastoTotal = Math.abs(
      filtradas
        .filter(t => t.valor < 0)
        .reduce((acc, t) => acc + t.valor, 0)
    );

    localStorage.setItem('filtro_mes', this.dataAtual.toISOString());
    localStorage.setItem('filtro_categoria', this.categoriaSelecionada || '');
  }

  salvarMeta() {
    localStorage.setItem('meta_mensal', this.metaMensal.toString());
  }

  get percentualMeta() {
    if (!this.metaMensal) return 0;
    return (this.gastoTotal / this.metaMensal) * 100;
  }

}