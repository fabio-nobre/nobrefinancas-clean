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
}