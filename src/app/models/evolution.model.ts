export interface NamedApiResource {
  name: string;
  url: string;
}

export interface ChainLink {
  is_baby: boolean;
  species: NamedApiResource;
  evolution_details: any[];
  evolves_to: ChainLink[];
}

export interface EvolutionChainDetailResponse {
  id: number;
  baby_trigger_item: any;
  chain: ChainLink;
}

export interface EvolutionChainSummary {
  url: string;
}

export interface EvolutionChainListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: EvolutionChainSummary[];
}

export interface EvolutionStage {
  name: string;
  id: number;
  imageUrl: string;
}

export interface EvolutionItem {
  id: number;
  url: string;
  chainText: string;
  species: EvolutionStage[];
}

export interface EvolutionResponse {
  count: number;
  results: EvolutionItem[];
}
