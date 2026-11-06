import { AsyncPipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { PokemonResponse } from '../models/pokemon.model';
import { PokemonService } from '../services/pokemon.service';

interface PokemonViewState {
  loading: boolean;
  data: PokemonResponse | null;
  error: string;
}

@Component({
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, TitleCasePipe],
  template: `
    <section class="page-heading">
      <p class="eyebrow">Ruta /pokemon</p>
      <h1>Pokédex</h1>
      <p>Los primeros Pokémon se consultan directamente desde PokéAPI.</p>
    </section>
    <ng-container *ngIf="pokemon$ | async as state">
      <p class="status" *ngIf="state.loading">Cargando Pokémon...</p>
      <p class="error" *ngIf="state.error">{{ state.error }}</p>
      <div class="pokemon-grid" *ngIf="state.data">
        <article class="pokemon-card" *ngFor="let pokemon of state.data.results; let index = index">
          <img [src]="'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + (index + 1) + '.png'" [alt]="pokemon.name" />
          <h2>{{ pokemon.name | titlecase }}</h2>
          <a [href]="pokemon.url" target="_blank" rel="noreferrer">Ver detalle ↗</a>
        </article>
      </div>
    </ng-container>
  `,
})
export class PokemonListComponent {
  private readonly pokemonService = inject(PokemonService);
  readonly pokemon$: Observable<PokemonViewState> = this.pokemonService.getPokemon().pipe(
    map((data) => ({ loading: false, data, error: '' })),
    startWith({ loading: true, data: null, error: '' }),
    catchError(() => of({ loading: false, data: null, error: 'No se pudo cargar la Pokédex.' })),
  );
}
