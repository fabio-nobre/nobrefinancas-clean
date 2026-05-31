import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Transaction } from '../../core/models/transaction.model';
import { TransactionService } from '../../core/services/transaction.service';
import { DashboardService } from '../../core/services/dashboard.service';

import { ChartComponent } from '../../shared/components/chart/chart.component';
import { TransactionModalComponent } from '../../shared/components/transaction-modal/transaction-modal.component';

import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { StatCardComponent } from '../../shared/ui/stat-card/stat-card.component';

import { DASHBOARD_LABELS } from '../../core/constants/dashboard.constants';

import { FinancialSummaryComponent } from './components/financial-summary/financial-summary.component';
import { AccountSummaryComponent } from './components/account-summary/account-summary.component';
import { MonthlyGoalComponent } from './components/monthly-goal/monthly-goal.component';
import { MonthlySummaryComponent } from './components/monthly-summary/monthly-summary.component';
import { ChartSectionComponent } from './components/chart-section/chart-section.component';
import { CreditCardInvoiceComponent } from './components/credit-card-invoice/credit-card-invoice.component';
import { DashboardFacade } from './facades/dashboard.facade';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChartComponent,
    TransactionModalComponent,
    PageHeaderComponent,
    StatCardComponent,
    FinancialSummaryComponent,
    AccountSummaryComponent,
    MonthlyGoalComponent,
    MonthlySummaryComponent,
    ChartSectionComponent,
    CreditCardInvoiceComponent
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  readonly labels = DASHBOARD_LABELS;

  // ===== DADOS =====
  saldo = 0;
  entradas = 0;
  saidas = 0;

  etiquettes: string[] = [];
  valores: number[] = [];

  categorias: string[] = [];
  categoriaSelecionada: string | null = null;

  contaSelecionada: string | null = null;

  dataAtual = new Date();

  // ===== META =====
  metaMensal = 0;
  gastoTotal = 0;
  percentualMeta = 0;

  // ===== INSIGHTS =====
  topCategoria = '';
  topValor = 0;
  resumo = '';

  // ===== CONTAS =====
  saldoPorConta: Record<string, number> = {};

  // ===== CARTÃO =====
  faturaCartao: Record<string, number> = {};

  // ===== RESUMO RECEITA / DESPESA =====
  totalReceitas = 0;
  totalDespesas = 0;

  // ===== UI =====
  modalAberto = false;
  darkMode = false;

  menuAberto = false;

  tipoModal:
    | 'despesa'
    | 'receita'
    | 'transferencia'
    | 'credito' = 'despesa';

  // ===== REATIVIDADE =====
  constructor(
    private transactionsService:
      TransactionService,

    private dashboard:
      DashboardService,

    private facade:
      DashboardFacade,

    private cdr:
      ChangeDetectorRef
  ) { }

  ngOnInit() {

    // DARK MODE
    const saved =
      localStorage.getItem('darkMode');

    if (saved === 'true') {
      this.darkMode = true;
      document.body.classList.add('dark');
    }

    this.facade
      .vm$
      .subscribe(vm => {

        this.saldo =
          vm.saldo;

        this.entradas =
          vm.entradas;

        this.saidas =
          vm.saidas;

        this.etiquettes =
          vm.etiquettes;

        this.valores =
          vm.valores;

        this.saldoPorConta =
          vm.saldoPorConta;

        this.resumo =
          vm.resumo;

        this.topCategoria =
          vm.topCategoria;

      });

    this.facade
      .dashboardData$
      .subscribe(({
        transactions: data,
        dataAtual,
        categoria,
        conta
      }) => {

        // FILTRO MÊS
        const porMes =
          this.transactionsService
            .filtrarPorMes(data, dataAtual);

        let filtradas = porMes;

        // FILTRO CONTA
        if (conta) {

          filtradas = filtradas.filter(t => {

            if (t.tipo === 'transferencia') {

              return (
                t.conta === conta ||
                t.contaDestino === conta
              );
            }

            return t.conta === conta;
          });
        }

        // FILTRO CATEGORIA
        if (categoria) {

          filtradas =
            filtradas.filter(t =>
              t.tipo !== 'transferencia'
              && t.categoria === categoria
            );
        }


        // ===== CATEGORIAS =====
        this.categorias = [

          ...new Set(

            filtradas
              .map(t => t.categoria)
              .filter(
                (c): c is string => !!c
              )

          )
        ];

        // ===== META =====
        this.gastoTotal =
          Math.abs(this.saidas);

        this.percentualMeta =
          this.metaMensal
            ? (
              this.gastoTotal /
              this.metaMensal
            ) * 100
            : 0;

        // ===== TOP =====
        const maior =
          this.etiquettes.length
            ? this.etiquettes
              .map((l, i) => ({
                l,
                v: this.valores[i]
              }))
              .sort((a, b) =>
                b.v - a.v
              )[0]
            : null;

        this.topCategoria =
          maior?.l || '';

        this.topValor =
          maior?.v || 0;

        // ===== RESUMO =====
        this.resumo =
          filtradas.length
            ? `Em ${dataAtual.toLocaleDateString(
              'pt-BR',
              {
                month: 'long',
                year: 'numeric'
              }
            )}, você gastou ${this.gastoTotal.toLocaleString(
              'pt-BR',
              {
                style: 'currency',
                currency: 'BRL'
              }
            )}. ${this.topCategoria} foi sua principal categoria.`
            : 'Sem dados neste mês';

        // ===== CONTAS =====
        this.saldoPorConta =
          this.dashboard
            .getSaldoPorConta(porMes);

        // ===== RECEITA / DESPESA =====
        this.totalReceitas =
          this.dashboard
            .calcularEntradas(filtradas);

        this.totalDespesas =
          this.dashboard
            .calcularSaidas(filtradas);

        // ===== FATURA =====
        const mesAtual =
          this.facade
            .dataAtual
            .toISOString()
            .substring(0, 7);

        this.faturaCartao =
          this.dashboard
            .getFaturaPorCartao(
              data,
              mesAtual
            );
      });

  }

  // ===== MENU =====
  abrirMenu() {
    this.menuAberto =
      !this.menuAberto;
  }

  abrirModalTipo(tipo: any) {

    this.tipoModal = tipo;

    this.modalAberto = true;

    this.menuAberto = false;
  }

  abrirModal() {
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
  }

  // ===== FATURA =====
  pagarFatura(
    cartao: string,
    valor: number
  ) {

    const atual =
      this.transactionsService.getAll();

    const pagamento: Transaction = {
      id: Date.now().toString(),
      tipo: 'despesa',
      descricao:
        `Pagamento fatura ${cartao}`,
      valor: -Math.abs(valor),
      categoria: 'Cartão',
      data:
        new Date()
          .toISOString(),
      conta: 'Banco'
    };

    const atualizadas:
      Transaction[] =
      atual.map(t => {

        if (
          t.tipo === 'credito'
          && t.cartao === cartao
          && !t.pago
        ) {

          return {
            ...t,
            pago: true
          };
        }

        return t;
      });

    this.transactionsService
      .updateAll([
        ...atualizadas,
        pagamento
      ]);
  }

  // ===== FILTROS =====
  recalcular() {

    this.facade
      .atualizarCategoria(
        this.categoriaSelecionada
      );
  }

  onContaChange() {

    this.facade
      .atualizarConta(
        this.contaSelecionada
      );
  }

  // ===== MÊS =====
  mesAnterior() {

    const nova =
      new Date(
        this.dataAtual
          .getFullYear(),

        this.dataAtual
          .getMonth() - 1,

        1
      );

    this.dataAtual = nova;

    this.dataAtual =
      this.facade
        .dataAtual;

    this.facade
      .atualizarMes(nova);
  }

  proximoMes() {

    const nova =
      new Date(
        this.dataAtual
          .getFullYear(),

        this.dataAtual
          .getMonth() + 1,

        1
      );

    this.dataAtual = nova;

    this.dataAtual =
      this.facade
        .dataAtual;

    this.facade
      .atualizarMes(nova);
  }

  // ===== DARK MODE =====
  toggleDarkMode() {

    this.darkMode =
      !this.darkMode;

    if (this.darkMode) {

      document.body
        .classList
        .add('dark');

      localStorage.setItem(
        'darkMode',
        'true'
      );

    } else {

      document.body
        .classList
        .remove('dark');

      localStorage.setItem(
        'darkMode',
        'false'
      );
    }
  }

  trackByTransaction(index: number, transaction: any): string | number {
    return transaction.id ?? index;
  }

  onMetaMensalChange(
    value: number
  ): void {
    this.metaMensal = value;

    this.recalcular();

    this.cdr.detectChanges();
  }

}