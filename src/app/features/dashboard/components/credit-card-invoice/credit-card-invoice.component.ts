import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-credit-card-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './credit-card-invoice.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditCardInvoiceComponent {

  @Input()
  faturaCartao:
    Record<string, number> = {};

  @Output()
  pagar =
    new EventEmitter<{
      cartao: string;
      valor: number;
    }>();


  pagarFatura(
    cartao: string,
    valor: number
  ) {

    this.pagar.emit({
      cartao,
      valor
    });
  }

}