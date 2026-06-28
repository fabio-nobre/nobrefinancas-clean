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
}