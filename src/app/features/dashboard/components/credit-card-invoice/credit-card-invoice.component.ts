import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { CommonModule }
  from '@angular/common';

import {
  FormsModule
} from '@angular/forms';


@Component({
  selector: 'app-credit-card-invoice',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './credit-card-invoice.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditCardInvoiceComponent {

  @Input()
  contas: string[] =
    [];

  @Input()
  faturaCartao:
    Record<string, number> = {};

  @Output()
  pagar =
    new EventEmitter<{
      cartao: string;
      valor: number;
      conta: string;
    }>();

  pagarFatura(
    cartao: string,
    valor: number
  ) {

    this.pagar.emit({

      cartao,

      valor,

      conta:
        this
          .contaSelecionada[
        cartao
        ]
    });
  }

  contaSelecionada:
    Record<string, string>
    = {};
}