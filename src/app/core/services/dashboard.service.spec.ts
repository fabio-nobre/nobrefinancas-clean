
import { TestBed } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';
import { Transaction } from '../models/transaction.model';

describe('DashboardService', () => {
  let service: DashboardService;

  const compraCartao: Transaction = {
    id: 'teste-1',
    tipo: 'credito',
    descricao: 'TESTE - Compra no cartão',
    valor: -100,
    categoria: 'Alimentação',
    data: '2026-10-21',
    conta: 'Nubank',
    cartao: 'Nubank',
    faturaMes: '2026-10'
  };

  const pagamentoFatura: Transaction = {
    id: 'teste-2',
    tipo: 'despesa',
    subtipo: 'pagamentoFatura',
    descricao: 'Pagamento fatura Nubank',
    valor: -100,
    categoria: 'Cartão',
    data: '2026-10-21',
    conta: 'Banco'
  };

  const despesaComum: Transaction = {
    id: 'teste-3',
    tipo: 'despesa',
    descricao: 'TESTE - Despesa comum',
    valor: -20,
    categoria: 'Transporte',
    data: '2026-10-21',
    conta: 'Carteira'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardService);
  });

  it('deve calcular as saídas sem duplicar o pagamento da fatura', () => {
    const resultado = service.calcularSaidas([
      compraCartao,
      pagamentoFatura,
      despesaComum
    ]);

    expect(resultado).toBe(-120);
  });

  it('deve calcular o saldo sem considerar o pagamento como nova despesa', () => {
    const resultado = service.calcularSaldo([
      compraCartao,
      pagamentoFatura,
      despesaComum
    ]);

    expect(resultado).toBe(-120);
  });

  it('deve excluir o pagamento da fatura dos gastos por categoria', () => {
    const resultado = service.getGastosPorCategoria([
      compraCartao,
      pagamentoFatura,
      despesaComum
    ]);

    expect(resultado.labels).toEqual([
      'Alimentação',
      'Transporte'
    ]);

    expect(resultado.valores).toEqual([
      100,
      20
    ]);

    expect(resultado.labels).not.toContain('Cartão');
  });

  it('deve classificar despesas sem categoria como Outros', () => {
    const despesaSemCategoria: Transaction = {
      id: 'teste-4',
      tipo: 'despesa',
      descricao: 'TESTE - Sem categoria',
      valor: -15,
      data: '2026-10-21'
    };

    const resultado = service.getGastosPorCategoria([
      despesaSemCategoria
    ]);

    expect(resultado.labels).toEqual(['Outros']);
    expect(resultado.valores).toEqual([15]);
  });

  it('deve debitar a conta bancária no pagamento sem debitar novamente a compra', () => {
    const resultado = service.getSaldoPorConta([
      compraCartao,
      pagamentoFatura
    ]);

    expect(resultado).toEqual({
      Banco: -100
    });
  });

  it('deve transferir valor entre contas sem alterar o saldo total', () => {
    const transferencia: Transaction = {
      id: 'teste-transferencia',
      tipo: 'transferencia',
      descricao: 'TESTE - Transferência entre contas',
      valor: 40,
      data: '2026-10-21',
      conta: 'Banco',
      contaDestino: 'Carteira'
    };

    const resultado =
      service.getSaldoPorConta([transferencia]);

    expect(resultado).toEqual({
      Banco: -40,
      Carteira: 40
    });

    const saldoTotal =
      Object.values(resultado)
        .reduce((total, saldo) => total + saldo, 0);

    expect(saldoTotal).toBe(0);
  });

  it('deve considerar apenas compras pendentes na fatura do cartão', () => {
    const compraPaga: Transaction = {
      ...compraCartao,
      id: 'teste-5',
      descricao: 'Compra já paga',
      valor: -50,
      pago: true
    };

    const compraOutroMes: Transaction = {
      ...compraCartao,
      id: 'teste-6',
      descricao: 'Compra de outro mês',
      valor: -30,
      faturaMes: '2026-09'
    };

    const resultado = service.getFaturaPorCartao(
      [
        compraCartao,
        compraPaga,
        compraOutroMes
      ],
      '2026-10'
    );

    expect(resultado).toEqual({
      Nubank: 100
    });
  });
});
