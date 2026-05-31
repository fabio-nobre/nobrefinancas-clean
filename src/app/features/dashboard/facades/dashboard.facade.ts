import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  map
} from 'rxjs';

import { TransactionService } from '../../../core/services/transaction.service';
import { DashboardService } from '../../../core/services/dashboard.service';

interface DashboardViewModel {

  saldo: number;

  entradas: number;

  saidas: number;

  etiquettes: string[];

  valores: number[];

  saldoPorConta:
  Record<string, number>;

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
      DashboardService
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
            filtradas.reduce(
              (acc, t) => {

                const conta =
                  t.conta ??
                  'Sem conta';

                if (!acc[conta]) {
                  acc[conta] = 0;
                }

                if (
                  t.tipo ===
                  'receita'
                ) {

                  acc[conta] +=
                    t.valor;
                }

                if (
                  t.tipo ===
                  'despesa'
                ) {

                  acc[conta] -=
                    t.valor;
                }

                return acc;

              },

              {} as Record<
                string,
                number
              >
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

            etiquettes: [
              'Receitas',
              'Despesas'
            ],

            valores: [
              entradas,
              saidas
            ]

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