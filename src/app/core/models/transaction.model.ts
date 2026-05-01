export interface Transaction {
  id: string;

  tipo: 'receita' | 'despesa' | 'transferencia';

  descricao: string;
  valor: number;
  categoria?: string;

  data: Date;

  contaOrigem?: string;
  contaDestino?: string;
}