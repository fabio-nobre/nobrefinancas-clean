import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BehaviorSubject, combineLatest } from 'rxjs';

import { TransactionService } from '../../core/services/transaction.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { TransactionModalComponent } from '../../shared/components/transaction-modal/transaction-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChartComponent,
    TransactionModalComponent
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  // ====== DADOS EXIBIDOS ======
  saldo = 0;
  entradas = 0;
  saidas = 0;

  labels: string[] = [];
  valores: number[] = [];

  categorias: string[] = [];
  categoriaSelecionada: string | null = null;

  dataAtual = new Date();

  // ====== META / INSIGHTS ======
  metaMensal = 0;
  gastoTotal = 0;
  percentualMeta = 0;

  topCategoria = '';
  topValor = 0;

  resumo = '';

  saldoPorConta: Record<string, number> = {};

  // ====== CONTROLE REATIVO ======
  private dataAtual$ = new BehaviorSubject<Date>(this.dataAtual);
  private categoriaSelecionada$ = new BehaviorSubject<string | null>(this.categoriaSelecionada);

  // ====== UI ======
  modalAberto = false;
  darkMode = false;

  constructor(
    private transactionsService: TransactionService,
    private dashboard: DashboardService
  ) { }

  ngOnInit() {

    // 🌙 dark mode persistência
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
      this.darkMode = true;
      document.body.classList.add('dark');
    }

    // 🔥 REATIVIDADE TOTAL
    combineLatest([
      this.transactionsService.transactions$,
      this.dataAtual$,
      this.categoriaSelecionada$
    ]).subscribe(([data, dataAtual, categoria]) => {

      console.log('DATA TOTAL:', data);

      // filtro por mês
      const porMes = this.transactionsService.filtrarPorMes(data, dataAtual);

      // filtro por categoria
      const filtradas = categoria
        ? porMes.filter(t => t.categoria === categoria)
        : porMes;

      // cards
      this.saldo = this.dashboard.calcularSaldo(filtradas);
      this.entradas = this.dashboard.calcularEntradas(filtradas);
      this.saidas = this.dashboard.calcularSaidas(filtradas);

      // gráfico
      const grafico = this.dashboard.getGastosPorCategoria(filtradas);
      this.labels = grafico.labels;
      this.valores = grafico.valores;

      // categorias (sem undefined)
      this.categorias = [
        ...new Set(
          data
            .map(t => t.categoria)
            .filter((c): c is string => !!c)
        )
      ];

      // ===== META =====
      this.gastoTotal = Math.abs(this.saidas);

      this.percentualMeta = this.metaMensal
        ? (this.gastoTotal / this.metaMensal) * 100
        : 0;

      // ===== TOP CATEGORIA =====
      const maior = this.labels.length
        ? this.labels
          .map((l, i) => ({ l, v: this.valores[i] }))
          .sort((a, b) => b.v - a.v)[0]
        : null;

      this.topCategoria = maior?.l || '';
      this.topValor = maior?.v || 0;

      // ===== RESUMO =====
      this.resumo = filtradas.length
        ? `Em ${dataAtual.toLocaleDateString('pt-BR', {
          month: 'long',
          year: 'numeric'
        })}, você gastou ${this.gastoTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })}. ${this.topCategoria} foi sua principal categoria.`
        : 'Sem dados neste mês';

      this.saldoPorConta = this.dashboard.getSaldoPorConta(filtradas);
    });

  }

  // ====== MÊS ======
  mesAnterior() {
    const nova = new Date(
      this.dataAtual.getFullYear(),
      this.dataAtual.getMonth() - 1,
      1
    );

    this.dataAtual = nova;
    this.dataAtual$.next(nova);
  }

  proximoMes() {
    const nova = new Date(
      this.dataAtual.getFullYear(),
      this.dataAtual.getMonth() + 1,
      1
    );

    this.dataAtual = nova;
    this.dataAtual$.next(nova);
  }

  // ====== FILTRO ======
  recalcular() {
    this.categoriaSelecionada$.next(this.categoriaSelecionada);
  }

  // ====== MODAL ======
  abrirModal() {
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
  }

  // ====== DARK MODE ======
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