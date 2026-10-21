export interface Transaction {

  id: string;

  tipo: 'receita' | 'despesa' | 'transferencia' | 'credito';

  /**
   * Identifica operações específicas que não representam
   * novo consumo financeiro, como o pagamento de fatura.
   */
  subtipo?: 'pagamentoFatura';

  descricao: string;
  valor: number;

  categoria?: string;

  data: string; // YYYY-MM-DD

  conta?: string;
  contaDestino?: string;

  cartao?: string;
  faturaMes?: string;

  pago?: boolean;
}