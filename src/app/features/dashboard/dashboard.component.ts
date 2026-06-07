import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import {
  MatDialog,
  MatDialogModule
} from '@angular/material/dialog';

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
    MatDialogModule,
    ChartComponent,
    TransactionModalComponent,
    PageHeaderComponent,
    StatCardComponent,
    FinancialSummaryComponent,
    AccountSummaryComponent,
    MonthlyGoalComponent,
    MonthlySummaryComponent,
    ChartSectionComponent,
    CreditCardInvoiceComponent,
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

  contas: string[] =
    [
      'Banco',
      'Carteira'
    ];

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
      ChangeDetectorRef,

    private dialog:
      MatDialog
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

        this.faturaCartao =
          vm.faturaCartao;

        this.gastoTotal =
          vm.gastoTotal;

        this.percentualMeta =
          vm.percentualMeta;
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

        // ===== RECEITA / DESPESA =====
        this.totalReceitas =
          this.dashboard
            .calcularEntradas(filtradas);

        this.totalDespesas =
          this.dashboard
            .calcularSaidas(filtradas);

      });

  }

  // ===== MENU =====
  abrirMenu() {
    this.menuAberto =
      !this.menuAberto;
  }

  abrirModalTipo(
    tipo:
      | 'despesa'
      | 'receita'
      | 'transferencia'
      | 'credito'
  ): void {

    this.menuAberto = false;

    const dialogRef =
      this.dialog.open(
        TransactionModalComponent,
        {
          width: '620px',
          maxWidth: '95vw',
          autoFocus: false,
          panelClass:
            'transaction-dialog'
        }
      );

    const instance =
      dialogRef.componentInstance;

    instance.tipoInicial =
      tipo;

    instance.salvarTransacao
      .subscribe(
        transaction => {

          this.salvarTransacao(
            transaction
          );

          dialogRef.close();
        }
      );
  }



  abrirModalMaterial(): void {

    console.log(
      'MatDialog pronto'
    );
  }



  salvarTransacao(
    transaction: Transaction
  ): void {

    this
      .transactionsService
      .add(transaction);

  }

  // ===== FATURA =====
  pagarFatura(
    cartao: string,
    valor: number,
    conta: string
  ) {

    const atual =
      this
        .transactionsService
        .getAll();

    const pagamento:
      Transaction = {

      id:
        Date.now()
          .toString(),

      tipo:
        'despesa',

      descricao:
        `Pagamento fatura ${cartao}`,

      valor:
        -Math.abs(
          valor
        ),

      categoria:
        'Cartão',

      data:
        new Date()
          .toISOString(),

      conta
    };

    const atualizadas:
      Transaction[] =
      atual.map(t => {

        if (

          t.tipo ===
          'credito'

          &&

          t.cartao ===
          cartao

          &&

          !t.pago

        ) {

          return {

            ...t,

            pago: true
          };
        }

        return t;
      });

    this
      .transactionsService
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

    this.facade.metaMensal = value;

    this.recalcular();

    this.cdr.detectChanges();
  }

}