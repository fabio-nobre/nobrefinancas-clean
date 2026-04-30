import { Component, OnInit } from '@angular/core';
import { MockDataService } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="p-6">
      <h1 class="text-xl font-bold mb-4">Dashboard</h1>

      <div class="bg-white shadow rounded-xl p-4">
        <p class="text-gray-500">Saldo total</p>
        <h2 class="text-2xl font-bold">
          R$ {{ total }}
        </h2>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {

  total = 0;

  constructor(private mock: MockDataService) { }

  ngOnInit() {
    const data = this.mock.getTransactions();

    console.log('🔥 DATA:', data);

    this.total = data.reduce((acc, t) => acc + t.valor, 0);
  }
}