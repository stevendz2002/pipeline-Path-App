import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero">
      <p class="eyebrow">Angular + PathLocationStrategy</p>
      <h1>Explora el mundo Pokémon.</h1>
      <p>Una aplicación Angular con rutas estándar basadas en PathLocationStrategy y datos obtenidos desde PokéAPI.</p>
      <a class="button" routerLink="/pokemon">Ver Pokédex</a>
    </section>
    <section class="feature-grid">
      <article><span>01</span><h2>Tres vistas</h2><p>Inicio, Pokémon y Proyecto se navegan con URLs limpias como <code>/pokemon</code>.</p></article>
      <article><span>02</span><h2>API real</h2><p>La lista de Pokémon se carga desde PokéAPI usando HttpClient.</p></article>
    </section>
  `,
})
export class HomeComponent {}
