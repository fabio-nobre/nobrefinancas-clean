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
      <div style="
        max-width: 1100px;
        margin: 0 auto;
        padding: 24px 16px;
        font-family: Inter, Arial, sans-serif;
      ">

        <!-- 🔥 HEADER -->
        <div style="
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
          align-items: center;
        ">

          <!-- TOGGLE DARK -->
          <button (click)="toggleDarkMode()" style="
            background: #111827;
            color: white;
            padding: 6px 10px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-size: 12px;
          ">
            {{ darkMode ? '☀️ Light' : '🌙 Dark' }}
          </button>

          <div style="text-align: center;">
            <h1 style="font-size: 26px; font-weight: bold; margin-bottom: 4px;">
              Dashboard
            </h1>

            <div style="font-size: 13px; color: #666;">
              {{ status === 'positivo' ? 'Situação positiva 👍' :
                status === 'negativo' ? 'Atenção aos gastos ⚠️' :
                'Equilibrado' }}
            </div>

            <div style="font-size: 13px; color: #666;">
              {{ insight }}
            </div>

            <div *ngIf="categoriaInsight" style="font-size: 13px; color: #7c3aed;">
              {{ categoriaInsight }}
            </div>
          </div>

          <!-- 📅 MÊS -->
          <div style="display: flex; align-items: center; gap: 10px;">

            <button (click)="mesAnterior()" style="
              background: #e5e7eb;
              border: none;
              padding: 6px 10px;
              border-radius: 6px;
              cursor: pointer;
            ">◀</button>

            <span style="font-weight: bold;">
              {{ dataAtual | date:'MMM yyyy':'':'pt-BR' }}
            </span>

            <button (click)="proximoMes()" style="
              background: #e5e7eb;
              border: none;
              padding: 6px 10px;
              border-radius: 6px;
              cursor: pointer;
            ">▶</button>

          </div>

          <!-- 📥 EXPORT -->
          <button (click)="exportarCSV()" style="
            background: #2563eb;
            color: white;
            padding: 10px 16px;
            border-radius: 10px;
            border: none;
            cursor: pointer;
            font-size: 13px;
          ">
            📥 Exportar CSV
          </button>

        </div>

        <!-- 💳 CARDS -->
        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        ">

          <div class="card" style="
            padding: 18px;
            border-radius: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          ">
            <p style="color:#666; font-size:13px;">Saldo</p>
            <h2 style="font-size:22px; color:#2563eb;">
              {{ saldo | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
            </h2>
          </div>

          <div class="card" style="
            background: #ecfdf5;
            padding: 18px;
            border-radius: 14px;
          ">
            <p style="font-size:13px;">Entradas</p>
            <h2 style="color:#16a34a;">
              {{ entradas | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
            </h2>
          </div>

          <div class="card" style="
            background: #fef2f2;
            padding: 18px;
            border-radius: 14px;
          ">
            <p style="font-size:13px;">Saídas</p>
            <h2 style="color:#dc2626;">
              {{ saidas | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
            </h2>
          </div>

        </div>

        <!-- ⚙️ FILTRO -->
        <div style="margin-top: 20px;">
          <label style="font-size: 13px;">Categoria:</label>
          <select [(ngModel)]="categoriaSelecionada" (change)="recalcular()" style="
            margin-left: 8px;
            padding: 6px;
            border-radius: 6px;
          ">
            <option [ngValue]="null">Todas</option>
            <option *ngFor="let c of categorias" [ngValue]="c">
              {{ c }}
            </option>
          </select>
        </div>

        <!-- 📊 GRID -->
        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 20px;
          margin-top: 20px;
        ">

          <!-- META -->
          <div class="card" style="
            padding: 18px;
            border-radius: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          ">
            <h3>Meta mensal</h3>

            <input type="number" [(ngModel)]="metaMensal" (input)="recalcular()" style="
              margin: 10px 0;
              padding: 6px;
              width: 100%;
            ">

            <div style="font-size: 13px;">
              {{ gastoTotal | currency:'BRL' }} de {{ metaMensal | currency:'BRL' }}
            </div>

            <div style="margin-top: 8px; background: #e5e7eb; height: 12px; border-radius: 6px;">
              <div
                [style.width.%]="percentualMeta > 100 ? 100 : percentualMeta"
                [style.background]="
                  percentualMeta < 70 ? '#22c55e' :
                  percentualMeta < 100 ? '#eab308' :
                  '#ef4444'
                "
                style="height: 12px;"
              ></div>
            </div>

            <div style="font-size: 12px; margin-top: 4px;">
              {{ percentualMeta | number:'1.0-0' }}%
            </div>

          </div>

          <!-- TOP -->
          <div *ngIf="topCategoria" class="card" style="
            background: #fef3c7;
            padding: 18px;
            border-radius: 14px;
          ">
            🥇 <strong>{{ topCategoria }}</strong><br>
            {{ topValor | currency:'BRL' }}
          </div>

          <!-- RESUMO -->
          <div class="card" style="
            background: #ecfeff;
            padding: 18px;
            border-radius: 14px;
          ">
            <strong>Resumo do mês</strong><br>
            {{ resumo }}
          </div>

        </div>

        <!-- GRÁFICO -->
        <div class="card" style="
          padding: 18px;
          border-radius: 14px;
          margin-top: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        ">
          <h3 style="text-align:center;">Gastos por categoria</h3>

          <div style="display:flex; justify-content:center; height:280px;">
            <app-chart [labels]="labels" [data]="valores"></app-chart>
          </div>

          <div *ngIf="labels.length === 0" style="text-align:center; color:#999;">
            Sem dados
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

  topCategoria = '';
  topValor = 0;

  alertaCategoria = '';

  resumo = '';

  darkMode = false;

  constructor(
    private transactionsService: TransactionService,
    private dashboard: DashboardService
  ) { }

  ngOnInit() {

    const saved = localStorage.getItem('darkMode');

    if (saved === 'true') {
      this.darkMode = true;
      document.body.classList.add('dark');
    }

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
    let maior = 0;
    let categoriaTop = '';

    Object.entries(atualCat).forEach(([cat, valor]) => {
      if (valor > maior) {
        maior = valor;
        categoriaTop = cat;
      }
    });

    this.topCategoria = categoriaTop;
    const total = this.gastoTotal;

    if (this.topCategoria && total > 0) {

      const percentual = (this.topValor / total) * 100;

      if (percentual > 70) {
        this.alertaCategoria = `🚨 ${this.topCategoria} representa ${percentual.toFixed(0)}% dos seus gastos`;
      } else if (percentual > 50) {
        this.alertaCategoria = `⚠️ ${this.topCategoria} já consome ${percentual.toFixed(0)}% dos seus gastos`;
      } else {
        this.alertaCategoria = '';
      }

    }

    this.topValor = maior;

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

    const mesNome = this.dataAtual.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });

    let texto = `Em ${mesNome}, você gastou ${this.gastoTotal.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })}.`;

    // meta
    if (this.metaMensal > 0) {
      if (this.gastoTotal > this.metaMensal) {
        texto += ' Você ultrapassou sua meta mensal.';
      } else {
        texto += ' Você ficou dentro da meta.';
      }
    }

    // top categoria
    if (this.topCategoria) {
      texto += ` ${this.topCategoria} foi sua principal categoria de gasto.`;
    }

    // insight geral
    if (this.insight) {
      texto += ` ${this.insight.replace(/⚠️|✅|✔️/g, '')}`;
    }

    this.resumo = texto;

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

  exportarCSV() {

    const data = this.transactionsService.getAll();

    const porMes = this.transactionsService.filtrarPorMes(
      data,
      this.dataAtual
    );

    const filtradas = this.dashboard.filtrarPorCategoria(
      porMes,
      this.categoriaSelecionada
    );

    // 🔥 cabeçalho
    let csv = 'Data;Descrição;Categoria;Valor\n';

    filtradas.forEach(t => {
      const dataFormatada = new Date(t.data).toLocaleDateString('pt-BR');

      csv += `${dataFormatada};${t.descricao};${t.categoria};${t.valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })}\n`;
    });

    // 🔥 criar arquivo
    const BOM = '\uFEFF';

    const blob = new Blob([BOM + csv], {
      type: 'text/csv;charset=utf-8;'
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio-${this.dataAtual.getMonth() + 1}-${this.dataAtual.getFullYear()}.csv`;

    link.click();
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;

    if (this.darkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }
}