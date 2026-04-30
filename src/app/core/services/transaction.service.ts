import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {

  private storageKey = 'transactions';

  getAll(): Transaction[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  saveAll(transactions: Transaction[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(transactions));
  }

  add(transaction: Transaction) {
    const list = this.getAll();
    list.push(transaction);
    this.saveAll(list);
  }

  remove(id: string) {
    const list = this.getAll().filter(t => t.id !== id);
    this.saveAll(list);
  }

}