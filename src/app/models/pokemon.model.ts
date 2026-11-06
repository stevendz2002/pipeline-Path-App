export interface PokemonSummary {
  name: string;
  url: string;
}

export interface PokemonResponse {
  count: number;
  results: PokemonSummary[];
}

export * from './evolution.model';

