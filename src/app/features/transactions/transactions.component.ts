import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../core/services/transaction.service';
import { Transaction } from '../../core/models/transaction.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="p-6 space-y-4">

      <h1 class="text-xl font-bold">Transações</h1>

      <form (submit)="adicionar()" class="flex gap-2">

        <input [(ngModel)]="descricao" name="descricao" placeholder="Descrição" class="border p-2" />

        <input [(ngModel)]="valor" name="valor" type="number" placeholder="Valor" class="border p-2" />

        <select [(ngModel)]="categoria" name="categoria" class="border p-2">
          <option value="Renda">Renda</option>
          <option value="Despesa">Despesa</option>
        </select>

        <button class="bg-blue-500 text-white px-4">
          Adicionar
        </button>

      </form>

      <div *ngFor="let t of transactions" class="flex justify-between bg-white p-2 rounded shadow">

        <span>{{ t.descricao }}</span>
        <span>R$ {{ t.valor }}</span>

        <button (click)="remover(t.id)" class="text-red-500">
          X
        </button>

      </div>

    </div>
  `
})
export class TransactionsComponent implements OnInit {

  transactions: Transaction[] = [];

  descricao = '';
  valor = 0;
  categoria = 'Despesa';

  constructor(private service: TransactionService) { }

  ngOnInit() {
    this.service.transactions$.subscribe(data => {
      this.transactions = data;
    });
  }

  adicionar() {

    const nova: Transaction = {
      id: Date.now().toString(),
      descricao: this.descricao,
      valor: this.categoria === 'Despesa' ? -Math.abs(this.valor) : Math.abs(this.valor),
      data: new Date(),
      categoria: this.categoria
    };

    this.service.add(nova);

    this.descricao = '';
    this.valor = 0;

  }

  remover(id: string) {
    this.service.remove(id);
  }
}