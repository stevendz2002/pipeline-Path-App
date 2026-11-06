import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EvolutionService } from './evolution.service';
import { EvolutionChainDetailResponse, EvolutionChainListResponse } from '../models/evolution.model';

describe('EvolutionService', () => {
  let service: EvolutionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EvolutionService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(EvolutionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch list and details of evolution chains', () => {
    const mockList: EvolutionChainListResponse = {
      count: 1,
      next: null,
      previous: null,
      results: [{ url: 'https://pokeapi.co/api/v2/evolution-chain/1/' }],
    };

    const mockDetail: EvolutionChainDetailResponse = {
      id: 1,
      baby_trigger_item: null,
      chain: {
        is_baby: false,
        species: {
          name: 'bulbasaur',
          url: 'https://pokeapi.co/api/v2/pokemon-species/1/',
        },
        evolution_details: [],
        evolves_to: [
          {
            is_baby: false,
            species: {
              name: 'ivysaur',
              url: 'https://pokeapi.co/api/v2/pokemon-species/2/',
            },
            evolution_details: [],
            evolves_to: [
              {
                is_baby: false,
                species: {
                  name: 'venusaur',
                  url: 'https://pokeapi.co/api/v2/pokemon-species/3/',
                },
                evolution_details: [],
                evolves_to: [],
              },
            ],
          },
        ],
      },
    };

    service.getEvolutions().subscribe((response) => {
      expect(response.count).toBe(1);
      expect(response.results.length).toBe(1);
      const item = response.results[0];
      expect(item.id).toBe(1);
      expect(item.chainText).toBe('Bulbasaur ➔ Ivysaur ➔ Venusaur');
      expect(item.species.length).toBe(3);
      expect(item.species[0].name).toBe('bulbasaur');
      expect(item.species[0].id).toBe(1);
      expect(item.species[0].imageUrl).toContain('/1.png');
      expect(item.species[2].name).toBe('venusaur');
      expect(item.species[2].id).toBe(3);
    });

    const listReq = httpMock.expectOne(service.apiUrl);
    expect(listReq.request.method).toBe('GET');
    listReq.flush(mockList);

    const detailReq = httpMock.expectOne('https://pokeapi.co/api/v2/evolution-chain/1/');
    expect(detailReq.request.method).toBe('GET');
    detailReq.flush(mockDetail);
  });

  it('should return empty results when list is empty', () => {
    const mockList: EvolutionChainListResponse = {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };

    service.getEvolutions().subscribe((response) => {
      expect(response.count).toBe(0);
      expect(response.results).toEqual([]);
    });

    const listReq = httpMock.expectOne(service.apiUrl);
    listReq.flush(mockList);
  });

  it('should correctly flatten branching evolution chains (e.g. Eevee)', () => {
    const branchingChain: EvolutionChainDetailResponse['chain'] = {
      is_baby: false,
      species: {
        name: 'eevee',
        url: 'https://pokeapi.co/api/v2/pokemon-species/133/',
      },
      evolution_details: [],
      evolves_to: [
        {
          is_baby: false,
          species: {
            name: 'vaporeon',
            url: 'https://pokeapi.co/api/v2/pokemon-species/134/',
          },
          evolution_details: [],
          evolves_to: [],
        },
        {
          is_baby: false,
          species: {
            name: 'jolteon',
            url: 'https://pokeapi.co/api/v2/pokemon-species/135/',
          },
          evolution_details: [],
          evolves_to: [],
        },
      ],
    };

    const stages = service.flattenChain(branchingChain);
    expect(stages.length).toBe(3);
    expect(stages.map((s) => s.name)).toEqual(['eevee', 'vaporeon', 'jolteon']);
  });

  it('should return empty array when flattenChain is called with undefined', () => {
    expect(service.flattenChain(undefined)).toEqual([]);
  });

  it('should extract numerical ID from species URL', () => {
    expect(service.extractIdFromUrl('https://pokeapi.co/api/v2/pokemon-species/25/')).toBe(25);
    expect(service.extractIdFromUrl('https://pokeapi.co/api/v2/pokemon-species/150')).toBe(150);
    expect(service.extractIdFromUrl('invalid-url')).toBe(0);
  });
});
