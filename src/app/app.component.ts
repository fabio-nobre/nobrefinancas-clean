import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="p-4 bg-gray-100 min-h-screen">

      <nav class="flex gap-4 mb-6">

        <a routerLink="/" class="text-blue-600 font-semibold">
          Dashboard
        </a>

        <a routerLink="/transactions" class="text-blue-600 font-semibold">
          Transações
        </a>

      </nav>

      <router-outlet />

    </div>
  `
})
export class AppComponent { }