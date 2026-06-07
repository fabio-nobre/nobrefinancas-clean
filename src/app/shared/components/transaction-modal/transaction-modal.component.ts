import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionModalComponent {

  @Output() fechado = new EventEmitter<void>();

  @Output()
  salvarTransacao =
    new EventEmitter<any>();

  @Input() tipoInicial: 'despesa' | 'receita' | 'transferencia' | 'credito' = 'despesa';

  @Input()
  transaction:
    any | null =
    null;

  tipo:
    | 'despesa'
    | 'receita'
    | 'transferencia'
    | 'credito'
    = 'despesa';

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


  ngOnInit() {

    // ADD MODE
    if (!this.transaction) {

      this.tipo =
        this.tipoInicial;

      return;
    }

    // EDIT MODE
    this.tipo =
      this.transaction.tipo;

    this.descricao =
      this.transaction.descricao;

    this.valor =
      Math.abs(
        this.transaction.valor
      );

    this.categoria =
      this.transaction.categoria ?? '';

    this.data =
      this.transaction.data
        ?.substring(0, 10);

    this.conta =
      this.transaction.conta
      ?? 'Carteira';

    this.contaDestino =
      this.transaction.contaDestino
      ?? 'Banco';

    this.cartao =
      this.transaction.cartao
      ?? 'Nubank';
  }

  salvar() {

    if (!this.valor) {
      return;
    }

    let valorFinal =
      this.valor;

    if (this.tipo === 'despesa') {
      valorFinal =
        -Math.abs(this.valor);
    }

    if (this.tipo === 'receita') {
      valorFinal =
        Math.abs(this.valor);
    }

    const transaction = {

      id:
        this.transaction?.id
        ??
        Date.now()
          .toString(),

      tipo:
        this.tipo,

      descricao:
        this.descricao,

      valor:
        this.tipo === 'credito'
          ? -Math.abs(this.valor)
          : valorFinal,

      categoria:
        this.tipo !== 'transferencia'
          ? this.categoria
          : undefined,

      data:
        this.data,

      conta:
        this.tipo === 'credito'
          ? this.cartao
          : this.conta,

      contaDestino:
        this.tipo ===
          'transferencia'
          ? this.contaDestino
          : undefined,

      cartao:
        this.tipo ===
          'credito'
          ? this.cartao
          : undefined,

      faturaMes:
        this.tipo ===
          'credito'
          ? this.data.substring(0, 7)
          : undefined
    };

    this.salvarTransacao
      .emit(transaction);

    this.fechar();
  }

  fechar() {
    this.fechado.emit();
  }

}