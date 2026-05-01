import { Component, OnInit } from '@angular/core';
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

      <!-- STATUS -->
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

      <div class="bg-blue-50 text-blue-700 p-3 rounded-xl text-sm">
        {{ insight }}
      </div>

      <div
        *ngIf="categoriaInsight"
        class="bg-purple-50 text-purple-700 p-3 rounded-xl text-sm"
      >
        {{ categoriaInsight }}
      </div>

      <!-- MÊS -->
      <div class="flex items-center gap-2">
        <button (click)="mesAnterior()" class="px-2 py-1 bg-gray-200 rounded">◀</button>
        <span class="font-semibold">
          {{ dataAtual | date:'MMM yyyy':'':'pt-BR' }}
        </span>
        <button (click)="proximoMes()" class="px-2 py-1 bg-gray-200 rounded">▶</button>
      </div>

      <!-- CARDS -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div class="bg-white p-5 rounded-2xl shadow">
          <p class="text-gray-500">Saldo</p>
          <h2 class="text-2xl font-bold text-blue-600">
            {{ saldo | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
          </h2>
        </div>

        <div class="bg-green-100 p-5 rounded-2xl">
          <p>Entradas</p>
          <h2 class="text-xl font-bold text-green-700">
            {{ entradas | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
          </h2>
        </div>

        <div class="bg-red-100 p-5 rounded-2xl">
          <p>Saídas</p>
          <h2 class="text-xl font-bold text-red-700">
            {{ saidas | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
          </h2>
        </div>

      </div>

      <!-- FILTRO -->
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

      <!-- META -->
      <div class="bg-white p-5 rounded-2xl shadow space-y-3">

        <div class="flex justify-between items-center">
          <h3 class="font-semibold">Meta mensal</h3>

          <input
            type="number"
            [(ngModel)]="metaMensal"
            (change)="salvarMeta()"
            class="border p-2 rounded w-32"
          />
        </div>

        <div class="text-sm text-gray-500">
          {{ gastoTotal | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
          de
          {{ metaMensal | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
        </div>

        <!-- BARRA -->
        <div style="max-width: 400px; width: 100%; background: #e5e7eb; border-radius: 6px; height: 16px; overflow: hidden;">

          <div
            [style.width.%]="percentualMeta > 100 ? 100 : percentualMeta"
            [style.background]="
              percentualMeta < 70 ? '#22c55e' :
              percentualMeta < 100 ? '#eab308' :
              '#ef4444'
            "
            style="height: 16px; transition: all 0.3s;"
          ></div>

        </div>

        <!-- 🔥 AQUI -->
        <div style="font-size: 12px; color: #666;">
          {{ percentualMeta | number:'1.0-0' }}%
        </div>

        <div class="text-xs text-gray-600">
          <span *ngIf="percentualMeta < 70">✔ Dentro do planejado</span>
          <span *ngIf="percentualMeta >= 70 && percentualMeta < 100">⚠ Atenção ao limite</span>
          <span *ngIf="percentualMeta >= 100">🚨 Meta ultrapassada</span>
        </div>

      </div>

      <!-- GRÁFICO -->
      <div class="bg-white p-5 rounded-2xl shadow">

        <h3 class="font-semibold mb-4">
          Gastos por categoria
        </h3>

        <div class="h-[300px] max-w-[400px] mx-auto">

          <div *ngIf="labels.length === 0" class="text-center text-gray-400">
            Sem dados
          </div>

          <app-chart
            *ngIf="labels.length > 0"
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

  insight = '';
  categoriaInsight = '';

  constructor(
    private transactionsService: TransactionService,
    private dashboard: DashboardService
  ) { }

  ngOnInit() {

    const mesSalvo = localStorage.getItem('filtro_mes');
    if (mesSalvo) this.dataAtual = new Date(mesSalvo);

    const categoriaSalva = localStorage.getItem('filtro_categoria');
    if (categoriaSalva) this.categoriaSelecionada = categoriaSalva;

    const metaSalva = localStorage.getItem('meta_mensal');
    if (metaSalva) this.metaMensal = Number(metaSalva);

    this.transactionsService.transactions$.subscribe(data => {
      this.categorias = [...new Set(data.map(t => t.categoria))];
      this.recalcular();
    });
  }

  recalcular() {

    const data = this.transactionsService.getAll();

    const porMes = this.transactionsService.filtrarPorMes(data, this.dataAtual);

    const filtradas = this.dashboard.filtrarPorCategoria(
      porMes,
      this.categoriaSelecionada
    );

    const mesAnterior = new Date(
      this.dataAtual.getFullYear(),
      this.dataAtual.getMonth() - 1,
      1
    );

    const dadosAnterior = this.transactionsService.filtrarPorMes(
      data,
      mesAnterior
    );

    const gastoAtual = Math.abs(
      filtradas
        .filter(t => t.valor < 0)
        .reduce((acc, t) => acc + t.valor, 0)
    );

    const gastoAnterior = Math.abs(
      dadosAnterior
        .filter(t => t.valor < 0)
        .reduce((acc, t) => acc + t.valor, 0)
    );

    if (gastoAnterior > 0) {

      const diff = ((gastoAtual - gastoAnterior) / gastoAnterior) * 100;

      if (diff > 10) {
        this.insight = `⚠️ Você gastou ${diff.toFixed(0)}% a mais que o mês passado`;
      } else if (diff < -10) {
        this.insight = `✅ Você economizou ${Math.abs(diff).toFixed(0)}%`;
      } else {
        this.insight = '✔️ Seus gastos estão estáveis';
      }

    } else {
      this.insight = 'Sem dados do mês anterior';
    }

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

    // 🔥 AGRUPAR
    const atualCat = this.agruparPorCategoria(filtradas);
    const anteriorCat = this.agruparPorCategoria(dadosAnterior);

    // 🔥 ANALISAR
    let maiorCategoria = '';
    let maiorDiff = 0;

    Object.keys(atualCat).forEach(cat => {

      const atual = atualCat[cat] || 0;
      const anterior = anteriorCat[cat] || 0;

      if (anterior === 0 && atual > 0) {

        // 🔥 categoria nova
        if (atual > maiorDiff) {
          maiorDiff = atual;
          maiorCategoria = cat;
        }

      } else if (anterior > 0) {

        const diff = ((atual - anterior) / anterior) * 100;

        if (Math.abs(diff) > Math.abs(maiorDiff)) {
          maiorDiff = diff;
          maiorCategoria = cat;
        }

      }

    });

    // 🔥 GERAR TEXTO
    if (maiorCategoria) {

      if (typeof maiorDiff === 'number' && maiorDiff > 1000) {
        this.categoriaInsight = `🆕 ${maiorCategoria} apareceu este mês`;
      } else if (maiorDiff > 10) {
        this.categoriaInsight = `📈 ${maiorCategoria} aumentou ${maiorDiff.toFixed(0)}%`;
      } else if (maiorDiff < -10) {
        this.categoriaInsight = `📉 ${maiorCategoria} caiu ${Math.abs(maiorDiff).toFixed(0)}%`;
      } else {
        this.categoriaInsight = `➡️ ${maiorCategoria} está estável`;
      }

    } else {
      this.categoriaInsight = 'Sem variação relevante por categoria';
    }

    this.atualizarStatus();

    localStorage.setItem('filtro_mes', this.dataAtual.toISOString());
    localStorage.setItem('filtro_categoria', this.categoriaSelecionada || '');
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

  salvarMeta() {
    localStorage.setItem('meta_mensal', this.metaMensal.toString());
  }

  get percentualMeta() {
    if (!this.metaMensal) return 0;
    return (this.gastoTotal / this.metaMensal) * 100;
  }

  private atualizarStatus() {
    if (this.saldo > 0) this.status = 'positivo';
    else if (this.saldo < 0) this.status = 'negativo';
    else this.status = 'neutro';
  }

  private agruparPorCategoria(transactions: any[]) {
    const mapa: Record<string, number> = {};

    transactions.forEach(t => {
      if (t.valor < 0) {
        mapa[t.categoria] = (mapa[t.categoria] || 0) + Math.abs(t.valor);
      }
    });

    return mapa;
  }
}