import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  map
} from 'rxjs';

import { TransactionService }
  from '../../../core/services/transaction.service';

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
      TransactionService
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