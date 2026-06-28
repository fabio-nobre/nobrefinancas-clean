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
    saidas: number,
    topCategoria: string,
    possuiDados: boolean
  ): string {

    if (!possuiDados) {
      return 'Sem dados neste mês';
    }

    return `Em ${dataAtual.toLocaleDateString(
      'pt-BR',
      {
        month: 'long',
        year: 'numeric'
      }
    )}, você gastou ${saidas.toLocaleString(
      'pt-BR',
      {
        style: 'currency',
        currency: 'BRL'
      }
    )}. ${topCategoria} foi sua principal categoria.`;
  }

}