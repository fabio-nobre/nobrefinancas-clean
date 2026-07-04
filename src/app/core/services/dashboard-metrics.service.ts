import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardMetricsService {

  getSaldoTotal(
    entradas: number,
    saidas: number
  ): number {

    return entradas - saidas;
  }


  getTopCategoria(
    categorias: Record<string, number>
  ): string {

    return Object.entries(
      categorias
    ).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] ?? 'Nenhuma';
  }

  getResumoMensal(
    dataAtual: Date,
    saldo: number,
    saidas: number,
    topCategoria: string,
    possuiDados: boolean
  ): string {

    if (!possuiDados) {
      return 'Sem dados neste mês';
    }

    const periodo =
      dataAtual.toLocaleDateString(
        'pt-BR',
        {
          month: 'long',
          year: 'numeric'
        }
      );

    if (saldo >= 0) {

      return `Em ${periodo}, você manteve saldo positivo. ${topCategoria} foi sua principal categoria de gasto.`;
    }

    return `Em ${periodo}, suas despesas superaram suas receitas. Revise principalmente os gastos com ${topCategoria}.`;
  }

  getSaudeFinanceira(
    saldo: number,
    percentualMeta: number
  ): number {

    if (
      saldo === 0
      &&
      percentualMeta === 0
    ) {
      return 0;
    }

    let score = 100;

    if (saldo < 0) {
      score -= 40;
    }

    if (percentualMeta > 100) {
      score -= 30;
    }

    if (percentualMeta > 120) {
      score -= 20;
    }

    return Math.max(
      0,
      Math.min(score, 100)
    );
  }

  getDiagnosticoFinanceiro(
    score: number
  ): string {

    if (score === 0) {
      return 'Sem movimentações no período';
    }

    if (score >= 90) {
      return 'Excelente controle financeiro';
    }

    if (score >= 70) {
      return 'Situação financeira saudável';
    }

    if (score >= 50) {
      return 'Atenção aos gastos do mês';
    }

    return 'Risco financeiro elevado';
  }

}