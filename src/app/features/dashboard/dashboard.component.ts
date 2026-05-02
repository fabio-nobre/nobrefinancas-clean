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

  contaSelecionada: string | null = null;
  private contaSelecionada$ = new BehaviorSubject<string | null>(null);

  totalReceitas = 0;
  totalDespesas = 0;



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
      this.categoriaSelecionada$,
      this.contaSelecionada$
    ]).subscribe(([data, dataAtual, categoria, conta]) => {

      console.log('DATA TOTAL:', data);

      // filtro por mês
      const porMes = this.transactionsService.filtrarPorMes(data, dataAtual);

      // filtro por categoria
      let filtradas = porMes;

      // 🔹 filtro por conta
      if (conta) {
        filtradas = filtradas.filter(t => {
          if (t.tipo === 'transferencia') {
            return t.conta === conta || t.contaDestino === conta;
          }
          return t.conta === conta;
        });
      }

      // 🔹 filtro por categoria (depois da conta)
      if (categoria) {
        filtradas = filtradas.filter(t =>
          t.tipo !== 'transferencia' &&
          t.categoria === categoria
        );
      }

      // cards
      this.saldo = this.dashboard.calcularSaldo(filtradas);
      this.entradas = this.dashboard.calcularEntradas(filtradas);
      this.saidas = this.dashboard.calcularSaidas(filtradas);

      // gráfico
      this.labels = ['Receitas', 'Despesas'];
      this.valores = [
        this.dashboard.calcularEntradas(filtradas),
        this.dashboard.calcularSaidas(filtradas)
      ];

      // categorias (sem undefined)
      this.categorias = [
        ...new Set(
          filtradas
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

      this.saldoPorConta = this.dashboard.getSaldoPorConta(porMes);

      this.totalReceitas = this.dashboard.calcularEntradas(filtradas);
      this.totalDespesas = this.dashboard.calcularSaidas(filtradas);

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

  onContaChange() {
    this.contaSelecionada$.next(this.contaSelecionada);
  }

}