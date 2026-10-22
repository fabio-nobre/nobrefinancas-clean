import { TestBed } from '@angular/core/testing';

import { TransactionService } from './transaction.service';
import { Transaction } from '../models/transaction.model';

describe('TransactionService', () => {
  let service: TransactionService;

  const storageKey = 'transactions';

  beforeEach(() => {
    localStorage.removeItem(storageKey);

    TestBed.configureTestingModule({
      providers: [TransactionService]
    });
  });

  afterEach(() => {
    localStorage.removeItem(storageKey);
  });

  it('deve iniciar sem transações quando não houver dados salvos', () => {
    service = TestBed.inject(TransactionService);

    expect(service.getAll()).toEqual([]);
  });

  it('deve identificar pagamentos de fatura antigos', () => {
    const transacoes: Transaction[] = [
      {
        id: 'pagamento-antigo',
        tipo: 'despesa',
        descricao: 'Pagamento fatura Nubank',
        valor: -100,
        categoria: 'Cartão',
        data: '2026-10-21',
        conta: 'Banco'
      }
    ];

    localStorage.setItem(
      storageKey,
      JSON.stringify(transacoes)
    );

    service = TestBed.inject(TransactionService);

    const resultado = service.getAll();

    expect(resultado.length).toBe(1);
    expect(resultado[0].subtipo)
      .toBe('pagamentoFatura');
  });

  it('deve preservar despesas comuns sem classificá-las como pagamento de fatura', () => {
    const transacoes: Transaction[] = [
      {
        id: 'despesa-comum',
        tipo: 'despesa',
        descricao: 'Supermercado',
        valor: -50,
        categoria: 'Alimentação',
        data: '2026-10-21',
        conta: 'Carteira'
      }
    ];

    localStorage.setItem(
      storageKey,
      JSON.stringify(transacoes)
    );

    service = TestBed.inject(TransactionService);

    const resultado = service.getAll();

    expect(resultado.length).toBe(1);
    expect(resultado[0].subtipo).toBeUndefined();
    expect(resultado[0].descricao).toBe('Supermercado');
  });

  it('não deve classificar uma compra de crédito como pagamento de fatura', () => {
    const transacoes: Transaction[] = [
      {
        id: 'compra-cartao',
        tipo: 'credito',
        descricao: 'Pagamento fatura fictício',
        valor: -30,
        data: '2026-10-21',
        cartao: 'Nubank',
        faturaMes: '2026-10'
      }
    ];

    localStorage.setItem(
      storageKey,
      JSON.stringify(transacoes)
    );

    service = TestBed.inject(TransactionService);

    const resultado = service.getAll();

    expect(resultado.length).toBe(1);
    expect(resultado[0].subtipo).toBeUndefined();
  });

  it('deve normalizar datas antigas que contenham horário', () => {
    const transacoes: Transaction[] = [
      {
        id: 'data-antiga',
        tipo: 'despesa',
        descricao: 'Compra antiga',
        valor: -25,
        data: '2026-10-21T12:00:00.000Z'
      }
    ];

    localStorage.setItem(
      storageKey,
      JSON.stringify(transacoes)
    );

    service = TestBed.inject(TransactionService);

    const resultado = service.getAll();

    expect(resultado[0].data).toBe('2026-10-21');
  });

  it('deve salvar os dados normalizados no localStorage', () => {
    const transacoes: Transaction[] = [
      {
        id: 'pagamento-antigo',
        tipo: 'despesa',
        descricao: 'Pagamento fatura Nubank',
        valor: -100,
        data: '2026-10-21T12:00:00.000Z'
      }
    ];

    localStorage.setItem(
      storageKey,
      JSON.stringify(transacoes)
    );

    service = TestBed.inject(TransactionService);

    const dadosSalvos = localStorage.getItem(storageKey);

    expect(dadosSalvos).not.toBeNull();

    const resultadoSalvo =
      JSON.parse(dadosSalvos!) as Transaction[];

    expect(resultadoSalvo.length).toBe(1);
    expect(resultadoSalvo[0].subtipo)
      .toBe('pagamentoFatura');
    expect(resultadoSalvo[0].data)
      .toBe('2026-10-21');
  });
});