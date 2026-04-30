import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class MockDataService {

  getTransactions(): Transaction[] {
    return [
      { id: '1', descricao: 'Salário', valor: 5000, data: new Date(), categoria: 'Renda' },
      { id: '2', descricao: 'Alimentação', valor: -300, data: new Date(), categoria: 'Despesa' },
      { id: '3', descricao: 'Transporte', valor: -150, data: new Date(), categoria: 'Despesa' }
    ];
  }

}