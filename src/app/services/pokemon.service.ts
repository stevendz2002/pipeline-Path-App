import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PokemonResponse } from '../models/pokemon.model';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=24';

  getPokemon(): Observable<PokemonResponse> {
    return this.http.get<PokemonResponse>(this.apiUrl);
  }
}
