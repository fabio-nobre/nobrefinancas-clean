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

}