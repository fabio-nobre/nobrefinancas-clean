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

    if (!data) {
      return [];
    }

    const parsed: Transaction[] = JSON.parse(data);

    const normalizado = parsed.map((t: Transaction) => {
      let transacao: Transaction = { ...t };

      // Normaliza datas antigas que possuem horário.
      if (
        typeof transacao.data === 'string' &&
        transacao.data.includes('T')
      ) {
        const d = new Date(transacao.data);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');

        transacao.data = `${yyyy}-${mm}-${dd}`;
      }

      /*
      * Migração de pagamentos de fatura antigos.
      * A identificação por descrição é usada apenas
      * nesta migração, para registros sem subtipo.
      */
      const pagamentoFaturaLegado =
        transacao.tipo === 'despesa' &&
        !transacao.subtipo &&
        typeof transacao.descricao === 'string' &&
        transacao.descricao.startsWith('Pagamento fatura ');

      if (pagamentoFaturaLegado) {
        transacao = {
          ...transacao,
          subtipo: 'pagamentoFatura'
        };
      }

      return transacao;
    });

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(normalizado)
    );

    return normalizado;
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