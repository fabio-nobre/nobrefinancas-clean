import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  map
} from 'rxjs';

import { TransactionService } from '../../../core/services/transaction.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { DashboardMetricsService } from '../../../core/services/dashboard-metrics.service';

interface DashboardViewModel {

  saldo: number;

  entradas: number;

  saidas: number;

  etiquettes: string[];

  valores: number[];

  saldoPorConta:
  Record<string, number>;

  resumo: string;

  topCategoria: string;

  faturaCartao:
  Record<string, number>;

  gastoTotal: number;

  percentualMeta: number;

  scoreFinanceiro: number;

  diagnosticoFinanceiro: string;

}

@Injectable({
  providedIn: 'root'
})
export class DashboardFacade {


  private dataAtual$ =
    new BehaviorSubject<Date>(
      new Date()
    );

  private categoriaSelecionada$ =
    new BehaviorSubject<
      string | null
    >(null);

  metaMensal = 0;

  private contaSelecionada$ =
    new BehaviorSubject<
      string | null
    >(null);

  get dataAtual(): Date {
    return this.dataAtual$.value;
  }

  get categoriaSelecionada():
    string | null {

    return this
      .categoriaSelecionada$
      .value;
  }

  get contaSelecionada():
    string | null {

    return this
      .contaSelecionada$
      .value;
  }

  constructor(
    private transactions:
      TransactionService,

    private dashboard:
      DashboardService,

    private metrics:
      DashboardMetricsService
  ) { }

  readonly dashboardData$ =
    combineLatest([
      this.transactions
        .transactions$,

      this.dataAtual$,

      this.categoriaSelecionada$,

      this.contaSelecionada$
    ]).pipe(

      map(([
        transactions,
        dataAtual,
        categoria,
        conta
      ]) => ({

        transactions,
        dataAtual,
        categoria,
        conta

      }))
    );

  readonly vm$ =
    this.dashboardData$
      .pipe(

        map(({
          transactions,
          dataAtual,
          categoria,
          conta
        }) => {

          const porMes =
            this.transactions
              .filtrarPorMes(
                transactions,
                dataAtual
              );

          let filtradas =
            porMes;

          // filtro conta
          if (conta) {

            filtradas =
              filtradas.filter(t => {

                if (
                  t.tipo ===
                  'transferencia'
                ) {

                  return (
                    t.conta === conta
                    ||
                    t.contaDestino
                    === conta
                  );
                }

                return (
                  t.conta === conta
                );
              });
          }

          // filtro categoria
          if (categoria) {

            filtradas =
              filtradas.filter(
                t =>
                  t.tipo !==
                  'transferencia'
                  &&
                  t.categoria
                  === categoria
              );
          }

          const entradas =
            this.dashboard
              .calcularEntradas(
                filtradas
              );

          const saidas =
            this.dashboard
              .calcularSaidas(
                filtradas
              );

          const saldoPorConta =
            this.dashboard
              .getSaldoPorConta(
                filtradas
              );

          const gastosPorCategoria =
            this.dashboard
              .getGastosPorCategoria(
                filtradas
              );

          const categorias =
            gastosPorCategoria.labels.reduce(
              (acc, categoria, index) => {

                acc[categoria] =
                  gastosPorCategoria.valores[index]
                  ?? 0;

                return acc;

              },
              {} as Record<string, number>
            );

          const topCategoria =
            this.metrics
              .getTopCategoria(
                categorias
              );

          const saldo =
            this.dashboard
              .calcularSaldo(
                filtradas
              );

          const resumo =
            this.metrics
              .getResumoMensal(
                dataAtual,
                saldo,
                saidas,
                topCategoria,
                filtradas.length > 0
              );

          const mesAtual =
            dataAtual
              .toISOString()
              .substring(0, 7);

          const faturaCartao =
            this.dashboard
              .getFaturaPorCartao(
                transactions,
                mesAtual
              );

          const gastoTotal =
            Math.abs(saidas);

          const percentualMeta =
            this.metaMensal
              ? (
                gastoTotal /
                this.metaMensal
              ) * 100
              : 0;

          const scoreFinanceiro =
            this.metrics.getSaudeFinanceira(
              saldo,
              percentualMeta
            );

          const diagnosticoFinanceiro =
            this.metrics.getDiagnosticoFinanceiro(
              scoreFinanceiro
            );

          return {

            saldo:
              this.dashboard
                .calcularSaldo(
                  filtradas
                ),

            entradas,

            saidas,

            saldoPorConta,

            resumo,

            topCategoria,

            faturaCartao,

            gastoTotal,

            percentualMeta,

            scoreFinanceiro,

            diagnosticoFinanceiro,

            etiquettes:
              gastosPorCategoria.labels,

            valores:
              gastosPorCategoria.valores

          } as DashboardViewModel;

        })
      );

  atualizarCategoria(
    categoria:
      string | null
  ) {

    this
      .categoriaSelecionada$
      .next(categoria);
  }

  atualizarConta(
    conta:
      string | null
  ) {

    this
      .contaSelecionada$
      .next(conta);
  }

  atualizarMes(
    data: Date
  ) {

    this
      .dataAtual$
      .next(data);
  }

}