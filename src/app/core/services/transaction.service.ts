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
    this.update(list);
  }

  remove(id: string) {
    const list = this.transactionsSubject.value.filter(t => t.id !== id);
    this.update(list);
  }
}