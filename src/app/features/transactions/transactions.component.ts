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
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  transactions: Transaction[] = [];

  categorias: Category[] = [];

  descricao = '';
  valor = 0;
  tipo: 'receita' | 'despesa' | 'transferencia' | 'credito' = 'despesa';

  categoria = '';

  novaCategoria = '';

  erro = '';

  editandoId: string | null = null;

  data: string = new Date().toISOString().substring(0, 10);
  // data = new Date().toISOString().substring(0, 10);

  conta = '';
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
      data: this.data,
      conta: this.conta,
      contaDestino: this.contaDestino
    };

    this.service.add(nova);

    this.resetForm();
  }

  editar(t: Transaction) {


    this.editandoId = t.id;

    this.tipo =
      t.tipo === 'credito'
        ? 'despesa'
        : t.tipo;

    this.descricao =
      t.descricao;

    this.valor =
      Math.abs(t.valor);

    this.categoria =
      t.categoria || '';

    this.data =
      new Date(t.data)
        .toISOString()
        .substring(0, 10);

    this.conta =
      t.conta || '';

    this.contaDestino =
      t.contaDestino || '';

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
          data: this.data,
          conta: this.conta,
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
    this.conta = '';
    this.contaDestino = '';
  }

  trackByTransaction(index: number, transaction: any): string | number {
    return transaction.id ?? index;
  }
}