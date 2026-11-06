import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { EvolutionListComponent } from './evolution-list.component';
import { EvolutionService } from '../services/evolution.service';
import { EvolutionResponse } from '../models/evolution.model';

describe('EvolutionListComponent', () => {
  let component: EvolutionListComponent;
  let fixture: ComponentFixture<EvolutionListComponent>;
  let evolutionServiceMock: jasmine.SpyObj<EvolutionService>;

  const mockEvolutionResponse: EvolutionResponse = {
    count: 2,
    results: [
      {
        id: 1,
        url: 'https://pokeapi.co/api/v2/evolution-chain/1/',
        chainText: 'Bulbasaur ➔ Ivysaur ➔ Venusaur',
        species: [
          { name: 'bulbasaur', id: 1, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' },
          { name: 'ivysaur', id: 2, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png' },
          { name: 'venusaur', id: 3, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png' },
        ],
      },
      {
        id: 2,
        url: 'https://pokeapi.co/api/v2/evolution-chain/2/',
        chainText: 'Charmander ➔ Charmeleon ➔ Charizard',
        species: [
          { name: 'charmander', id: 4, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png' },
          { name: 'charmeleon', id: 5, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png' },
          { name: 'charizard', id: 6, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png' },
        ],
      },
    ],
  };

  beforeEach(async () => {
    evolutionServiceMock = jasmine.createSpyObj<EvolutionService>('EvolutionService', ['getEvolutions']);

    await TestBed.configureTestingModule({
      imports: [EvolutionListComponent],
      providers: [{ provide: EvolutionService, useValue: evolutionServiceMock }],
    }).compileComponents();
  });

  it('should create the component', () => {
    evolutionServiceMock.getEvolutions.and.returnValue(of(mockEvolutionResponse));
    fixture = TestBed.createComponent(EvolutionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should display page headings and eyebrow text', () => {
    evolutionServiceMock.getEvolutions.and.returnValue(of(mockEvolutionResponse));
    fixture = TestBed.createComponent(EvolutionListComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.eyebrow')?.textContent).toContain('Ruta /evolutions');
    expect(compiled.querySelector('h1')?.textContent).toContain('Cadenas de Evolución');
  });

  it('should render evolution chains, stages, images, and links', () => {
    evolutionServiceMock.getEvolutions.and.returnValue(of(mockEvolutionResponse));
    fixture = TestBed.createComponent(EvolutionListComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.pokemon-card');
    expect(cards.length).toBe(2);

    const firstCard = cards[0];
    expect(firstCard.querySelector('h2')?.textContent).toContain('Bulbasaur ➔ Ivysaur ➔ Venusaur');

    const stages = firstCard.querySelectorAll('.evolution-stage');
    expect(stages.length).toBe(3);
    expect(stages[0].querySelector('img')?.getAttribute('src')).toContain('/1.png');
    expect(stages[0].textContent).toContain('Bulbasaur');

    const arrows = firstCard.querySelectorAll('.evolution-arrow');
    expect(arrows.length).toBe(2);

    const link = firstCard.querySelector('a');
    expect(link?.getAttribute('href')).toBe('https://pokeapi.co/api/v2/evolution-chain/1/');
  });

  it('should display error message when service throws an error', () => {
    evolutionServiceMock.getEvolutions.and.returnValue(throwError(() => new Error('Network error')));
    fixture = TestBed.createComponent(EvolutionListComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const errorEl = compiled.querySelector('.error');
    expect(errorEl).toBeTruthy();
    expect(errorEl?.textContent).toContain('No se pudieron cargar las evoluciones.');
  });
});
