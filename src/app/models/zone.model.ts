export interface NamedResource {
  name: string;
  url: string;
}

export interface ZoneListResponse {
  count: number;
  results: NamedResource[];
}

export interface ZoneDetail {
  id: number;
  name: string;
  pokemon_species: NamedResource[];
}
