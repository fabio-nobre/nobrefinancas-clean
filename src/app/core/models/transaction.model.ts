
export interface Transaction {

  id: string;

  tipo: 'receita' | 'despesa' | 'transferencia';

  descricao: string;
  valor: number;

  categoria?: string;

  data: string; // YYYY-MM-DD

  conta?: string;
  contaDestino?: string;

}