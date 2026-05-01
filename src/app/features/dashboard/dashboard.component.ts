import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  saldo = 0;
  entradas = 0;
  saidas = 0;

  labels: string[] = [];
  valores: number[] = [];

  categorias: string[] = [];
  categoriaSelecionada: string | null = null;

  dataAtual = new Date();

  // modal
  modalAberto = false;

  // dark mode
  darkMode = false;

  metaMensal = 0;
  gastoTotal = 0;
  percentualMeta = 0;

  topCategoria = '';
  topValor = 0;

  resumo = '';

  constructor(
    private transactionsService: TransactionService,
    private dashboard: DashboardService
  ) { }

  ngOnInit() {

    // dark mode persistência
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
      this.darkMode = true;
      document.body.classList.add('dark');
    }

    this.transactionsService.transactions$.subscribe(data => {

      console.log('DATA TOTAL:', data);

      this.processarDados(data);

      // categorias seguras (sem undefined)
      this.categorias = [
        ...new Set(
          data
            .map(t => t.categoria)
            .filter((c): c is string => !!c)
        )
      ];

      this.gastoTotal = Math.abs(this.saidas);

      this.percentualMeta = this.metaMensal
        ? (this.gastoTotal / this.metaMensal) * 100
        : 0;

      // TOP CATEGORIA
      const maior = this.labels.length
        ? this.labels.map((l, i) => ({ l, v: this.valores[i] }))
          .sort((a, b) => b.v - a.v)[0]
        : null;

      this.topCategoria = maior?.l || '';
      this.topValor = maior?.v || 0;

      // RESUMO
      this.resumo = `Você gastou ${this.gastoTotal.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })}. ${this.topCategoria} foi sua principal categoria.`;

    });
  }

  // navegação mês
  mesAnterior() {
    this.dataAtual = new Date(
      this.dataAtual.getFullYear(),
      this.dataAtual.getMonth() - 1,
      1
    );

    this.processarDados(this.transactionsService.getAll());
  }

  proximoMes() {
    this.dataAtual = new Date(
      this.dataAtual.getFullYear(),
      this.dataAtual.getMonth() + 1,
      1
    );

    this.processarDados(this.transactionsService.getAll());
  }

  // filtro
  recalcular() {
    this.processarDados(this.transactionsService.getAll());
  }

  // modal
  abrirModal() {
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
  }

  // dark mode
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

  private processarDados(data: any[]) {

    const porMes = this.transactionsService.filtrarPorMes(data, this.dataAtual);

    const filtradas = this.categoriaSelecionada
      ? porMes.filter(t => t.categoria === this.categoriaSelecionada)
      : porMes;

    this.saldo = this.dashboard.calcularSaldo(filtradas);
    this.entradas = this.dashboard.calcularEntradas(filtradas);
    this.saidas = this.dashboard.calcularSaidas(filtradas);

    const grafico = this.dashboard.getGastosPorCategoria(filtradas);

    this.labels = grafico.labels;
    this.valores = grafico.valores;
  }
}