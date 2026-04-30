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

      <div *ngIf="erro" class="text-red-500 text-sm">
        {{ erro }}
      </div>

      <form (submit)="adicionar()" class="flex gap-2">

        <input
          [(ngModel)]="descricao"
          name="descricao"
          placeholder="Descrição"
          class="border p-2 w-full"
        />
        <input
          [(ngModel)]="valor"
          name="valor"
          type="number"
          placeholder="Valor"
          class="border p-2 w-full"
        />
        <select [(ngModel)]="tipo" name="tipo" class="border p-2">
          <option value="Renda">Renda</option>
          <option value="Despesa">Despesa</option>
        </select>

        <select [(ngModel)]="categoria" name="categoria" class="border p-2">

          <option value="Alimentação">Alimentação</option>
          <option value="Transporte">Transporte</option>
          <option value="Moradia">Moradia</option>
          <option value="Lazer">Lazer</option>

        </select>

        <button
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Adicionar
        </button>

      </form>

      <div class="space-y-2">

        <div *ngFor="let t of transactions"
            class="flex justify-between items-center bg-white p-3 rounded-xl shadow">

          <div>
            <p class="font-semibold">{{ t.descricao }}</p>
            <p class="text-xs text-gray-400">{{ t.categoria }}</p>
          </div>

          <div class="text-right">
            <p [class.text-green-600]="t.valor > 0"
              [class.text-red-600]="t.valor < 0">

              R$ {{ t.valor }}
            </p>

            <button (click)="remover(t.id)" class="text-xs text-red-400">
              remover
            </button>
          </div>

        </div>

      </div>

    </div>
  `
})
export class TransactionsComponent implements OnInit {

  transactions: Transaction[] = [];

  descricao = '';
  valor = 0;

  tipo = 'Despesa';
  categoria = 'Alimentação';

  erro = '';

  constructor(private service: TransactionService) { }

  ngOnInit() {
    this.service.transactions$.subscribe(data => {
      this.transactions = data;
    });
  }

  adicionar() {

    this.erro = '';

    if (!this.descricao.trim()) {
      this.erro = 'Informe uma descrição';
      return;
    }

    if (!this.valor || this.valor <= 0) {
      this.erro = 'Informe um valor válido';
      return;
    }

    const nova: Transaction = {
      id: Date.now().toString(),
      descricao: this.descricao,
      valor: this.tipo === 'Despesa'
        ? -Math.abs(this.valor)
        : Math.abs(this.valor),
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