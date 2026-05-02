import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {

  private storageKey = 'transactions';

  private transactionsSubject = new BehaviorSubject<Transaction[]>(this.loadInitial());

  transactions$ = this.transactionsSubject.asObservable();

  private loadInitial(): Transaction[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private update(transactions: Transaction[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(transactions));
    this.transactionsSubject.next(transactions);
  }

  getAll(): Transaction[] {
    return this.transactionsSubject.value;
  }

  add(transaction: Transaction) {

    const list = [...this.transactionsSubject.value, transaction];

    localStorage.setItem(this.storageKey, JSON.stringify(list));

    this.transactionsSubject.next(list);
  }

  remove(id: string) {
    const list = this.transactionsSubject.value.filter(t => t.id !== id);
    this.update(list);
  }

  filtrarPorMes(transactions: Transaction[], dataRef: Date): Transaction[] {

    const mes = dataRef.getMonth();
    const ano = dataRef.getFullYear();

    return transactions.filter(t => {

      let data: Date;

      if (t.data.includes('T')) {
        // formato antigo (ISO)
        data = new Date(t.data);
      } else {
        // formato novo (YYYY-MM-DD)
        const [y, m, d] = t.data.split('-').map(Number);
        data = new Date(y, m - 1, d);
      }

      return data.getMonth() === mes && data.getFullYear() === ano;
    });
  }

  updateAll(transactions: Transaction[]) {
    this.update(transactions);
  }

}