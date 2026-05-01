import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  calcularSaldo(transactions: Transaction[]): number {
    return transactions.reduce((acc, t) => acc + t.valor, 0);
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

}