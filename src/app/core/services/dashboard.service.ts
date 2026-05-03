import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  calcularSaldo(transactions: any[]) {
    return transactions
      .filter(t => t.tipo !== 'credito') // 🔥 IGNORA CARTÃO
      .reduce((acc, t) => acc + t.valor, 0);
  }

  calcularEntradas(transactions: Transaction[]): number {
    return transactions
      .filter(t => t.valor > 0)
      .reduce((acc, t) => acc + t.valor, 0);
  }

  calcularSaidas(transactions: Transaction[]): number {
    return transactions
      .filter(t => t.valor < 0)
      .reduce((acc, t) => acc + t.valor, 0);
  }

  getGastosPorCategoria(transactions: Transaction[]) {

    const mapa: Record<string, number> = {};

    transactions.forEach(t => {
      if (t.valor < 0 && t.categoria) {
        mapa[t.categoria] = (mapa[t.categoria] || 0) + Math.abs(t.valor);
      }
    });

    return {
      labels: Object.keys(mapa),
      valores: Object.values(mapa)
    };
  }

  filtrarPorCategoria(transactions: Transaction[], categoria: string | null) {
    if (!categoria) return transactions;
    return transactions.filter(t => t.categoria === categoria);
  }

  getSaldoPorConta(transactions: any[]) {

    const mapa: Record<string, number> = {};

    transactions.forEach(t => {

      if (!t.conta) return;

      if (!mapa[t.conta]) mapa[t.conta] = 0;

      if (t.tipo === 'receita') {
        mapa[t.conta] += t.valor;
      }

      if (t.tipo === 'despesa') {
        mapa[t.conta] -= Math.abs(t.valor);
      }

      if (t.tipo === 'transferencia') {

        mapa[t.conta] -= Math.abs(t.valor);

        if (t.contaDestino) {
          if (!mapa[t.contaDestino]) mapa[t.contaDestino] = 0;
          mapa[t.contaDestino] += Math.abs(t.valor);
        }
      }

    });

    return mapa;
  }

  getFaturaPorCartao(transactions: any[], mes: string) {

    const mapa: Record<string, number> = {};

    transactions.forEach(t => {

      if (t.tipo !== 'credito' || t.pago) return;

      if (t.faturaMes !== mes) return;

      if (!mapa[t.cartao]) mapa[t.cartao] = 0;

      mapa[t.cartao] += Math.abs(t.valor);
    });

    return mapa;
  }

}