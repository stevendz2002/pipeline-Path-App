import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="shell">
      <header class="topbar">
        <a class="brand" routerLink="/">Poké<span>Dex</span></a>
        <nav aria-label="Navegación principal">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Inicio</a>
          <a routerLink="/pokemon" routerLinkActive="active">Pokémon</a>
          <a routerLink="/zonas" routerLinkActive="active">Zonas</a>
          <a routerLink="/about" routerLinkActive="active">Proyecto</a>
        </nav>
      </header>
      <main class="main-content"><router-outlet /></main>
      <footer>Datos proporcionados por <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">PokéAPI</a></footer>
    </div>
  `,
})
export class AppComponent {}
