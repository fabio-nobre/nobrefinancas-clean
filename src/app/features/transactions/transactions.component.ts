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
    <div style="
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      font-family: Inter, Arial, sans-serif;
    ">

      <h2 style="margin-bottom: 10px;">Transações</h2>

      <!-- 🔥 FORM -->
      <form
        (submit)="editandoId ? salvarEdicao() : adicionar()"
        class="card"
        style="
          display:flex;
          flex-direction:column;
          gap:10px;
          padding:16px;
          border-radius:12px;
          box-shadow:0 2px 8px rgba(0,0,0,0.05);
        "
      >

        <!-- TIPO -->
        <select [(ngModel)]="tipo" name="tipo">
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
          <option value="transferencia">Transferência</option>
        </select>

        <!-- DESCRIÇÃO -->
        <input
          [(ngModel)]="descricao"
          name="descricao"
          placeholder="Descrição"
        />

        <!-- VALOR -->
        <input
          type="number"
          [(ngModel)]="valor"
          name="valor"
          placeholder="Valor"
        />

        <!-- DATA -->
        <input
          type="date"
          [(ngModel)]="data"
          name="data"
        />

        <!-- CATEGORIA -->
        <select
          *ngIf="tipo !== 'transferencia'"
          [(ngModel)]="categoria"
          name="categoria"
        >
          <option *ngFor="let c of categorias" [value]="c.nome">
            {{ c.nome }}
          </option>
        </select>

        <!-- CONTAS -->
        <div *ngIf="tipo === 'transferencia'" style="display:flex; gap:10px;">

          <select [(ngModel)]="contaOrigem" name="contaOrigem">
            <option *ngFor="let c of contas" [value]="c">
              Origem: {{ c }}
            </option>
          </select>

          <select [(ngModel)]="contaDestino" name="contaDestino">
            <option *ngFor="let c of contas" [value]="c">
              Destino: {{ c }}
            </option>
          </select>

        </div>

        <!-- BOTÕES -->
        <div style="display:flex; gap:10px; margin-top:10px;">

          <button
            type="submit"
            style="
              background:#2563eb;
              color:white;
              padding:8px 12px;
              border:none;
              border-radius:8px;
              cursor:pointer;
            "
          >
            {{ editandoId ? 'Salvar' : 'Adicionar' }}
          </button>

          <button
            type="button"
            *ngIf="editandoId"
            (click)="cancelarEdicao()"
            style="
              background:#e5e7eb;
              padding:8px 12px;
              border:none;
              border-radius:8px;
              cursor:pointer;
            "
          >
            Cancelar
          </button>

        </div>

      </form>

      <!-- 🔥 LISTA -->
      <div style="margin-top:20px; display:flex; flex-direction:column; gap:10px;">

        <div
          *ngFor="let t of transactions"
          class="card"
          style="
            padding:12px;
            border-radius:10px;
            box-shadow:0 2px 6px rgba(0,0,0,0.05);
          "
        >

          <div style="display:flex; justify-content:space-between; align-items:center;">

            <div>
              <strong>{{ t.descricao }}</strong><br>

              <span style="font-size:12px; color:#666;">
                {{ t.categoria || t.tipo }}
              </span><br>

              <span style="font-size:12px;">
                {{ t.data | date:'dd/MM/yyyy' }}
              </span>
            </div>

            <div style="text-align:right;">

              <div
                [style.color]="t.valor < 0 ? '#dc2626' : '#16a34a'"
                style="font-weight:bold;"
              >
                {{ t.valor | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
              </div>

              <div style="display:flex; gap:6px; margin-top:6px;">

                <!-- EDITAR -->
                <button
                  (click)="editar(t)"
                  style="
                    background:#dbeafe;
                    border:none;
                    padding:4px 8px;
                    border-radius:6px;
                    cursor:pointer;
                  "
                >
                  ✏️
                </button>

                <!-- REMOVER -->
                <button
                  (click)="remover(t.id)"
                  style="
                    background:#fee2e2;
                    border:none;
                    padding:4px 8px;
                    border-radius:6px;
                    cursor:pointer;
                  "
                >
                  🗑️
                </button>

              </div>

            </div>

          </div>

        </div>

        <!-- EMPTY -->
        <div *ngIf="transactions.length === 0" style="text-align:center; color:#999;">
          Nenhuma transação cadastrada
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
  tipo: 'receita' | 'despesa' | 'transferencia' = 'despesa';
  categoria = '';

  novaCategoria = '';

  erro = '';

  editandoId: string | null = null;

  data: string = new Date().toISOString().substring(0, 10);
  // data = new Date().toISOString().substring(0, 10);

  contaOrigem = '';
  contaDestino = '';

  contas = ['Carteira', 'Banco', 'Cartão'];

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

    if (!this.descricao || !this.valor) return;

    let valorFinal = this.valor;

    if (this.tipo === 'despesa') {
      valorFinal = -Math.abs(this.valor);
    }

    if (this.tipo === 'receita') {
      valorFinal = Math.abs(this.valor);
    }

    const nova: Transaction = {
      id: Date.now().toString(),
      tipo: this.tipo,
      descricao: this.descricao,
      valor: valorFinal,
      categoria: this.tipo !== 'transferencia' ? this.categoria : undefined,
      data: new Date(this.data),
      contaOrigem: this.contaOrigem,
      contaDestino: this.contaDestino
    };

    this.service.add(nova);

    this.resetForm();
  }

  editar(t: Transaction) {

    this.editandoId = t.id;

    this.tipo = t.tipo;
    this.descricao = t.descricao;
    this.valor = Math.abs(t.valor);

    this.categoria = t.categoria || '';

    this.data = new Date(t.data).toISOString().substring(0, 10);

    this.contaOrigem = t.contaOrigem || '';
    this.contaDestino = t.contaDestino || '';
  }

  salvarEdicao() {

    if (!this.editandoId) return;

    const lista = this.service.getAll();

    let valorFinal = this.valor;

    if (this.tipo === 'despesa') {
      valorFinal = -Math.abs(this.valor);
    }

    if (this.tipo === 'receita') {
      valorFinal = Math.abs(this.valor);
    }

    const atualizadas = lista.map(t => {

      if (t.id === this.editandoId) {

        return {
          ...t,
          tipo: this.tipo,
          descricao: this.descricao,
          valor: valorFinal,
          categoria: this.tipo !== 'transferencia' ? this.categoria : undefined,
          data: new Date(this.data),
          contaOrigem: this.contaOrigem,
          contaDestino: this.contaDestino
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
    this.tipo = 'despesa';
    this.descricao = '';
    this.valor = 0;
    this.categoria = '';
    this.data = new Date().toISOString().substring(0, 10);
    this.contaOrigem = '';
    this.contaDestino = '';
  }
}