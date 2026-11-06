import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import {
  ChainLink,
  EvolutionChainDetailResponse,
  EvolutionChainListResponse,
  EvolutionItem,
  EvolutionResponse,
  EvolutionStage,
} from '../models/evolution.model';

@Injectable({ providedIn: 'root' })
export class EvolutionService {
  private readonly http = inject(HttpClient);
  readonly apiUrl = 'https://pokeapi.co/api/v2/evolution-chain?limit=12';

  getEvolutions(): Observable<EvolutionResponse> {
    return this.http.get<EvolutionChainListResponse>(this.apiUrl).pipe(
      switchMap((listResponse) => {
        if (!listResponse.results || listResponse.results.length === 0) {
          return of({ count: 0, results: [] });
        }

        const detailRequests = listResponse.results.map((item) =>
          this.http.get<EvolutionChainDetailResponse>(item.url)
        );

        return forkJoin(detailRequests).pipe(
          map((details) => ({
            count: listResponse.count,
            results: details.map((detail) => this.mapChainDetailToItem(detail)),
          }))
        );
      })
    );
  }

  mapChainDetailToItem(detail: EvolutionChainDetailResponse): EvolutionItem {
    const stages = this.flattenChain(detail.chain);
    const chainText = stages.map((s) => this.capitalize(s.name)).join(' ➔ ');

    return {
      id: detail.id,
      url: `https://pokeapi.co/api/v2/evolution-chain/${detail.id}/`,
      chainText: chainText || `Cadena #${detail.id}`,
      species: stages,
    };
  }

  flattenChain(node: ChainLink | undefined): EvolutionStage[] {
    const stages: EvolutionStage[] = [];
    if (!node) return stages;

    const traverse = (current: ChainLink) => {
      if (current?.species) {
        const id = this.extractIdFromUrl(current.species.url);
        stages.push({
          name: current.species.name,
          id,
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        });
      }

      if (current?.evolves_to && current.evolves_to.length > 0) {
        for (const next of current.evolves_to) {
          traverse(next);
        }
      }
    };

    traverse(node);
    return stages;
  }

  extractIdFromUrl(url: string): number {
    const matches = /\/(\d+)\/?$/.exec(url);
    return matches ? Number(matches[1]) : 0;
  }

  private capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
