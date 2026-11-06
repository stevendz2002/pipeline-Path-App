import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PokemonListComponent } from './pokemon-list.component';
import { PokemonService } from '../services/pokemon.service';
import { PokemonResponse } from '../models/pokemon.model';

describe('PokemonListComponent', () => {
  let component: PokemonListComponent;
  let fixture: ComponentFixture<PokemonListComponent>;
  let pokemonServiceMock: jasmine.SpyObj<PokemonService>;

  const mockPokemonResponse: PokemonResponse = {
    count: 2,
    results: [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
    ],
  };

  beforeEach(async () => {
    pokemonServiceMock = jasmine.createSpyObj<PokemonService>('PokemonService', ['getPokemon']);

    await TestBed.configureTestingModule({
      imports: [PokemonListComponent],
      providers: [{ provide: PokemonService, useValue: pokemonServiceMock }],
    }).compileComponents();
  });

  it('should create the component', () => {
    pokemonServiceMock.getPokemon.and.returnValue(of(mockPokemonResponse));
    fixture = TestBed.createComponent(PokemonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should render pokemon cards with sprites and links', () => {
    pokemonServiceMock.getPokemon.and.returnValue(of(mockPokemonResponse));
    fixture = TestBed.createComponent(PokemonListComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.pokemon-card');
    expect(cards.length).toBe(2);
    expect(cards[0].querySelector('h2')?.textContent).toContain('Bulbasaur');
    expect(cards[0].querySelector('img')?.getAttribute('src')).toContain('/1.png');
    expect(cards[0].querySelector('a')?.getAttribute('href')).toBe('https://pokeapi.co/api/v2/pokemon/1/');
  });

  it('should display error message on failure', () => {
    pokemonServiceMock.getPokemon.and.returnValue(throwError(() => new Error('API failure')));
    fixture = TestBed.createComponent(PokemonListComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const errorEl = compiled.querySelector('.error');
    expect(errorEl).toBeTruthy();
    expect(errorEl?.textContent).toContain('No se pudo cargar la Pokédex.');
  });
});
