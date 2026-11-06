import { AsyncPipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { EvolutionResponse } from '../models/evolution.model';
import { EvolutionService } from '../services/evolution.service';

export interface EvolutionViewState {
  loading: boolean;
  data: EvolutionResponse | null;
  error: string;
}

@Component({
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, TitleCasePipe],
  template: `
    <section class="page-heading">
      <p class="eyebrow">Ruta /evolutions</p>
      <h1>Cadenas de Evolución</h1>
      <p>Las cadenas de evolución de Pokémon se consultan directamente desde PokéAPI.</p>
    </section>
    <ng-container *ngIf="evolutions$ | async as state">
      <p class="status" *ngIf="state.loading">Cargando evoluciones...</p>
      <p class="error" *ngIf="state.error">{{ state.error }}</p>
      <div class="pokemon-grid evolution-grid" *ngIf="state.data">
        <article class="pokemon-card evolution-card" *ngFor="let evolution of state.data.results">
          <div class="evolution-chain-flow">
            <ng-container *ngFor="let stage of evolution.species; let last = last">
              <div class="evolution-stage">
                <img [src]="stage.imageUrl" [alt]="stage.name" />
                <span class="stage-name">{{ stage.name | titlecase }}</span>
              </div>
              <span class="evolution-arrow" *ngIf="!last">➔</span>
            </ng-container>
          </div>
          <h2>{{ evolution.chainText }}</h2>
          <a [href]="evolution.url" target="_blank" rel="noreferrer">Ver detalle ↗</a>
        </article>
      </div>
    </ng-container>
  `,
})
export class EvolutionListComponent {
  private readonly evolutionService = inject(EvolutionService);
  readonly evolutions$: Observable<EvolutionViewState> = this.evolutionService.getEvolutions().pipe(
    map((data) => ({ loading: false, data, error: '' })),
    startWith({ loading: true, data: null, error: '' }),
    catchError(() => of({ loading: false, data: null, error: 'No se pudieron cargar las evoluciones.' })),
  );
}
