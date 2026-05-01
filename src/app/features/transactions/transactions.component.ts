import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TransactionService } from '../../core/services/transaction.service';
import { CategoryService } from '../../core/services/category.service';

import { Transaction } from '../../core/models/transaction.model';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 space-y-6">

      <h1 class="text-2xl font-bold">Transações</h1>

      <!-- FORM -->
      <form
        (submit)="editandoId ? salvarEdicao() : adicionar()"
        class="flex flex-col gap-3 bg-white p-4 rounded-xl shadow"
      >
        <input
          type="date"
          [(ngModel)]="data"
          name="data"
          class="border p-2 rounded"
        />

        <!-- ERRO -->
        <div *ngIf="erro" class="text-red-500 text-sm">
          {{ erro }}
        </div>

        <!-- DESCRIÇÃO -->
        <input
          [(ngModel)]="descricao"
          name="descricao"
          placeholder="Descrição"
          class="border p-2 rounded"
          [class.border-red-400]="!descricao"
        />

        <!-- VALOR -->
        <input
          [(ngModel)]="valor"
          name="valor"
          type="number"
          placeholder="Valor"
          class="border p-2 rounded"
          [class.border-red-400]="valor <= 0"
        />

        <!-- TIPO -->
        <select [(ngModel)]="tipo" name="tipo" class="border p-2 rounded">
          <option value="Renda">Renda</option>
          <option value="Despesa">Despesa</option>
        </select>

        <!-- CATEGORIA -->
        <select [(ngModel)]="categoria" name="categoria" class="border p-2 rounded">
          <option *ngFor="let c of categorias" [value]="c.nome">
            {{ c.nome }}
          </option>
        </select>

        <!-- NOVA CATEGORIA -->
        <div class="flex gap-2">

          <input
            [(ngModel)]="novaCategoria"
            name="novaCategoria"
            placeholder="Nova categoria"
            class="border p-2 rounded w-full"
          />

          <button
            type="button"
            (click)="adicionarCategoria()"
            class="bg-green-500 text-white px-3 rounded"
          >
            +
          </button>

        </div>

        <!-- BOTÕES -->
        <div class="flex gap-2">

          <button
            type="submit"
            [disabled]="formInvalido"
            class="px-4 py-2 rounded text-white"
            [class.bg-gray-400]="formInvalido"
            [class.bg-blue-600]="!formInvalido"
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

        </div>

      </form>

      <!-- EMPTY STATE -->
      <div *ngIf="transactions.length === 0" class="text-center text-gray-400">
        Nenhuma transação cadastrada
      </div>

      <!-- LISTA -->
      <div class="space-y-3">

        <div
          *ngFor="let t of transactions"
          class="flex justify-between items-center bg-white p-4 rounded-xl shadow"
        >

          <div>
            <p class="font-semibold">{{ t.descricao }}</p>
            <p class="text-xs text-gray-400">{{ t.categoria }}</p>
          </div>

          <div class="text-right">

            <p
              class="font-bold"
              [class.text-green-600]="t.valor > 0"
              [class.text-red-600]="t.valor < 0"
            >
              {{ t.valor | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
            </p>

            <div class="flex gap-2 justify-end">

              <button
                (click)="editar(t)"
                class="text-xs text-blue-500 hover:text-blue-700"
              >
                editar
              </button>

              <button
                (click)="remover(t.id)"
                class="text-xs text-red-400 hover:text-red-600"
              >
                remover
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  `
})
export class TransactionsComponent implements OnInit {

  transactions: Transaction[] = [];

  categorias: Category[] = [];

  descricao = '';
  valor = 0;
  tipo = 'Despesa';
  categoria = 'Alimentação';

  novaCategoria = '';

  erro = '';

  editandoId: string | null = null;

  data: string = new Date().toISOString().substring(0, 10);

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

  get formInvalido() {
    return !this.descricao.trim() || !this.valor || this.valor <= 0;
  }

  adicionar() {

    this.erro = '';

    if (this.formInvalido) {
      this.erro = 'Preencha os campos corretamente';
      return;
    }

    const nova: Transaction = {
      id: Date.now().toString(),
      descricao: this.descricao,
      valor: this.tipo === 'Despesa'
        ? -Math.abs(this.valor)
        : Math.abs(this.valor),
      data: new Date(this.data),
      categoria: this.categoria
    };

    this.service.add(nova);

    this.resetForm();
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
    this.resetForm();
  }

  remover(id: string) {
    this.service.remove(id);
  }

  adicionarCategoria() {
    if (!this.novaCategoria.trim()) return;

    this.categoryService.add(this.novaCategoria);
    this.novaCategoria = '';
  }

  private resetForm() {
    this.descricao = '';
    this.valor = 0;
    this.tipo = 'Despesa';
    this.categoria = this.categorias[0]?.nome || '';
    this.data = new Date().toISOString().substring(0, 10);
  }
}