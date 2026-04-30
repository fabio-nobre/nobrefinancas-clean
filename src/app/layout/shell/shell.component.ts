import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="flex min-h-screen bg-gray-100">

      <!-- Sidebar -->
      <aside class="w-60 bg-white shadow p-4">

        <h1 class="text-xl font-bold mb-6">
          Nobre Finanças
        </h1>

        <nav class="flex flex-col gap-3">

          <a routerLink="/" class="hover:text-blue-600">
            Dashboard
          </a>

          <a routerLink="/transactions" class="hover:text-blue-600">
            Transações
          </a>

        </nav>

      </aside>

      <!-- Conteúdo -->
      <main class="flex-1 p-6">
        <router-outlet />
      </main>

    </div>
  `
})
export class ShellComponent { }