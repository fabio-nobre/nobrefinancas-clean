import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction.service';

@Component({
  selector: 'app-transaction-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-modal.component.html'
})
export class TransactionModalComponent {

  @Output() fechado = new EventEmitter<void>();

  tipo: 'receita' | 'despesa' | 'transferencia' = 'despesa';

  descricao = '';
  valor = 0;
  categoria = '';
  data = new Date().toISOString().substring(0, 10);

  contaOrigem = '';
  contaDestino = '';

  categorias = ['Alimentação', 'Transporte', 'Moradia'];
  contas = ['Carteira', 'Banco', 'Cartão'];

  constructor(private service: TransactionService) { }

  salvar() {

    if (!this.valor) return;

    let valorFinal = this.valor;

    if (this.tipo === 'despesa') valorFinal = -Math.abs(this.valor);
    if (this.tipo === 'receita') valorFinal = Math.abs(this.valor);

    this.service.add({
      id: Date.now().toString(),
      tipo: this.tipo,
      descricao: this.descricao,
      valor: valorFinal,
      categoria: this.tipo !== 'transferencia' ? this.categoria : undefined,
      data: new Date(this.data),
      contaOrigem: this.contaOrigem,
      contaDestino: this.contaDestino
    });

    this.fechar();
  }

  fechar() {
    this.fechado.emit();
  }

}