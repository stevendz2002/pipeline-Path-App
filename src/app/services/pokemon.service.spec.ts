import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PokemonService } from './pokemon.service';
import { PokemonResponse } from '../models/pokemon.model';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PokemonService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get pokemon list', () => {
    const mockResponse: PokemonResponse = {
      count: 2,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      ],
    };

    service.getPokemon().subscribe((res) => {
      expect(res.count).toBe(2);
      expect(res.results.length).toBe(2);
      expect(res.results[0].name).toBe('bulbasaur');
    });

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon?limit=24');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
