import { AsyncPipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, map, Observable, of, startWith, switchMap } from 'rxjs';
import { ZoneDetail, ZoneListResponse } from '../models/zone.model';
import { ZoneService } from '../services/zone.service';

interface ZoneViewState {
  loadingZones: boolean;
  zones: ZoneListResponse | null;
  selectedZoneName: string;
  loadingDetail: boolean;
  zoneDetail: ZoneDetail | null;
  error: string;
}

@Component({
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, TitleCasePipe],
  template: `
    <section class="page-heading">
      <p class="eyebrow">Ruta /zonas</p>
      <h1>Zonas y Hábitats</h1>
      <p>Descubre qué Pokémon se encuentran y habitan en cada zona y entorno natural consultado desde PokéAPI.</p>
    </section>

    <ng-container *ngIf="viewState$ | async as state">
      <p class="status" *ngIf="state.loadingZones">Cargando zonas...</p>
      <p class="error" *ngIf="state.error">{{ state.error }}</p>

      <!-- Selector de zonas -->
      <div class="zone-selector" *ngIf="state.zones">
        <button
          type="button"
          class="zone-pill"
          *ngFor="let zone of state.zones.results"
          [class.active]="zone.name === state.selectedZoneName"
          (click)="selectZone(zone.name)"
        >
          {{ zone.name | titlecase }}
        </button>
      </div>

      <!-- Detalle de la zona seleccionada -->
      <p class="status" *ngIf="state.loadingDetail">Cargando Pokémon de la zona {{ state.selectedZoneName | titlecase }}...</p>

      <section *ngIf="state.zoneDetail as detail">
        <div class="zone-summary">
          <h2>Hábitat: {{ detail.name | titlecase }}</h2>
          <span class="badge">{{ detail.pokemon_species.length }} Pokémon en esta zona</span>
        </div>

        <div class="pokemon-grid" *ngIf="detail.pokemon_species.length > 0; else noPokemon">
          <article class="pokemon-card" *ngFor="let pokemon of detail.pokemon_species">
            <img [src]="getPokemonSprite(pokemon.url)" [alt]="pokemon.name" loading="lazy" />
            <h2>{{ pokemon.name | titlecase }}</h2>
            <a [href]="pokemon.url" target="_blank" rel="noreferrer">Ver detalle ↗</a>
          </article>
        </div>

        <ng-template #noPokemon>
          <p class="status">No se registraron Pokémon en esta zona.</p>
        </ng-template>
      </section>
    </ng-container>
  `,
})
export class ZoneListComponent {
  private readonly zoneService = inject(ZoneService);
  private readonly selectedZoneSubject = new BehaviorSubject<string>('forest');

  readonly selectedZone$ = this.selectedZoneSubject.asObservable();

  readonly zones$ = this.zoneService.getZones().pipe(
    catchError(() => of(null)),
  );

  readonly viewState$: Observable<ZoneViewState> = combineLatest([
    this.zones$,
    this.selectedZone$,
  ]).pipe(
    switchMap(([zones, selectedZoneName]) => {
      const activeZone = selectedZoneName || zones?.results?.[0]?.name || 'forest';
      return this.zoneService.getZoneDetail(activeZone).pipe(
        map((zoneDetail) => ({
          loadingZones: false,
          zones,
          selectedZoneName: activeZone,
          loadingDetail: false,
          zoneDetail,
          error: '',
        })),
        startWith({
          loadingZones: !zones,
          zones,
          selectedZoneName: activeZone,
          loadingDetail: true,
          zoneDetail: null,
          error: '',
        }),
        catchError(() =>
          of({
            loadingZones: false,
            zones,
            selectedZoneName: activeZone,
            loadingDetail: false,
            zoneDetail: null,
            error: 'No se pudieron cargar los datos de la zona seleccionada.',
          }),
        ),
      );
    }),
    startWith({
      loadingZones: true,
      zones: null,
      selectedZoneName: 'forest',
      loadingDetail: true,
      zoneDetail: null,
      error: '',
    }),
    catchError(() =>
      of({
        loadingZones: false,
        zones: null,
        selectedZoneName: '',
        loadingDetail: false,
        zoneDetail: null,
        error: 'Error al conectar con el servicio de zonas.',
      }),
    ),
  );

  selectZone(zoneName: string): void {
    this.selectedZoneSubject.next(zoneName);
  }

  getPokemonSprite(url: string): string {
    const parts = url.split('/').filter(Boolean);
    const id = parts[parts.length - 1];
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }
}
