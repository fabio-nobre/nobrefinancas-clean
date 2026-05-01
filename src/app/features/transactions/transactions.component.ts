import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../core/services/transaction.service';
import { Transaction } from '../../core/models/transaction.model';
import { CommonModule } from '@angular/common';
import { Category } from '../../core/models/category.model';
import { CategoryService } from '../../core/services/category.service';

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

      <form (submit)="editandoId ? salvarEdicao() : adicionar()">

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

        <div class="flex gap-2 mt-2">

          <input
            [(ngModel)]="novaCategoria"
            name="novaCategoria"
            placeholder="Nova categoria"
            class="border p-2"
          />

          <button
            type="button"
            (click)="adicionarCategoria()"
            class="bg-green-500 text-white px-3 rounded"
          >
            +
          </button>

        </div>

        <button
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {{ editandoId ? 'Salvar' : 'Adicionar' }}
        </button>
        <button
          *ngIf="editandoId"
          type="button"
          (click)="cancelarEdicao()"
          class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>

      </form>

      <div class="space-y-3">

        <div *ngFor="let t of transactions"
            class="flex justify-between items-center bg-white p-4 rounded-xl shadow">

          <div>
            <p class="font-semibold">{{ t.descricao }}</p>
            <p class="text-xs text-gray-400">{{ t.categoria }}</p>
          </div>

          <div class="text-right">

            <p
              [class.text-green-600]="t.valor > 0"
              [class.text-red-600]="t.valor < 0"
              class="font-bold"
            >
              R$ {{ t.valor }}
            </p>

            <button
              (click)="remover(t.id)"
              class="text-xs text-red-400 hover:text-red-600"
            >
              remover
            </button>

            <button
              (click)="editar(t)"
              class="text-xs text-blue-500 hover:text-blue-700"
            >
            editar
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

  editandoId: string | null = null;

  categorias: Category[] = [];

  constructor(
    private service: TransactionService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.service.transactions$.subscribe(data => {
      this.transactions = data;
    });
    this.categoryService.categories$.subscribe(c => {
      this.categorias = c;
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

  editar(t: Transaction) {
    this.editandoId = t.id;

    this.descricao = t.descricao;
    this.valor = Math.abs(t.valor);
    this.tipo = t.valor < 0 ? 'Despesa' : 'Renda';
    this.categoria = t.categoria;
  }

  salvarEdicao() {

    if (!this.editandoId) return;

    const atualizadas = this.transactions.map(t => {
      if (t.id === this.editandoId) {
        return {
          ...t,
          descricao: this.descricao,
          valor: this.tipo === 'Despesa'
            ? -Math.abs(this.valor)
            : Math.abs(this.valor),
          categoria: this.categoria
        };
      }
      return t;
    });

    this.service.updateAll(atualizadas);

    this.cancelarEdicao();
  }

  cancelarEdicao() {
    this.editandoId = null;
    this.descricao = '';
    this.valor = 0;
  }

  novaCategoria = '';

  adicionarCategoria() {
    if (!this.novaCategoria.trim()) return;

    this.categoryService.add(this.novaCategoria);
    this.novaCategoria = '';
  }
}