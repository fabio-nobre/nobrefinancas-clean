import { Component, OnInit } from '@angular/core';
import { MockDataService } from '../../core/services/mock-data.service';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="p-6 space-y-4">

      <h1 class="text-xl font-bold">Dashboard</h1>

      <div class="grid grid-cols-3 gap-4">

        <div class="bg-white p-4 rounded-xl shadow">
          <p class="text-gray-500">Saldo</p>
          <h2 class="text-xl font-bold">
            R$ {{ saldo }}
          </h2>
        </div>

        <div class="bg-green-100 p-4 rounded-xl">
          <p>Entradas</p>
          <h2 class="font-bold text-green-700">
            R$ {{ entradas }}
          </h2>
        </div>

        <div class="bg-red-100 p-4 rounded-xl">
          <p>Saídas</p>
          <h2 class="font-bold text-red-700">
            R$ {{ saidas }}
          </h2>
        </div>

      </div>

    </div>
  `
})
export class DashboardComponent implements OnInit {

  saldo = 0;
  entradas = 0;
  saidas = 0;

  constructor(
    private mock: MockDataService,
    private dashboard: DashboardService
  ) { }

  ngOnInit() {
    const data = this.mock.getTransactions();

    console.log('🔥 DATA:', data);

    this.saldo = this.dashboard.calcularSaldo(data);
    this.entradas = this.dashboard.calcularEntradas(data);
    this.saidas = this.dashboard.calcularSaidas(data);
  }
}