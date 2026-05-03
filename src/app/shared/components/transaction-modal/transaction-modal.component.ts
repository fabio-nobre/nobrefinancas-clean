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

  tipo: any = 'despesa';

  descricao = '';
  valor = 0;
  categoria = '';
  data = new Date().toISOString().substring(0, 10);

  conta = 'Carteira';
  contaDestino = 'Banco';

  categorias = ['Alimentação', 'Transporte', 'Moradia'];
  contas = ['Carteira', 'Banco', 'Cartão'];

  cartoes: string[] = ['Nubank', 'Inter'];
  cartao = 'Nubank';

  constructor(private service: TransactionService) { }

  salvar() {

    if (!this.valor) return;

    let valorFinal = this.valor;
    const faturaMes = this.data.substring(0, 7);

    // 💳 CARTÃO DE CRÉDITO
    if (this.tipo === 'credito') {

      this.service.add({
        id: Date.now().toString(),
        tipo: 'credito',
        descricao: this.descricao,
        valor: -Math.abs(this.valor),
        categoria: this.categoria,
        data: this.data,
        cartao: this.cartao,
        faturaMes: this.data.substring(0, 7)
      });

      this.fechar();
      return;
    }

    // 💰 RECEITA / DESPESA / TRANSFERÊNCIA
    if (this.tipo === 'despesa') valorFinal = -Math.abs(this.valor);
    if (this.tipo === 'receita') valorFinal = Math.abs(this.valor);

    this.service.add({
      id: Date.now().toString(),
      tipo: this.tipo,
      descricao: this.descricao,
      valor: valorFinal,
      categoria: this.tipo !== 'transferencia' ? this.categoria : undefined,
      data: this.data,
      conta: this.tipo === 'credito' ? this.cartao : this.conta,
      contaDestino: this.tipo === 'transferencia' ? this.contaDestino : undefined
    });

    this.fechar();
  }

  fechar() {
    this.fechado.emit();
  }

}