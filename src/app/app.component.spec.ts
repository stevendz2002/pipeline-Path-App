import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

describe('AppComponent', () => {
  it('renders the application brand and navigation', async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.brand').textContent).toContain('PokéDex');
    const navLinks = fixture.nativeElement.querySelectorAll('nav a');
    expect(navLinks.length).toBe(5);
    expect(navLinks[0].textContent).toContain('Inicio');
    expect(navLinks[1].textContent).toContain('Pokémon');
    expect(navLinks[2].textContent).toContain('Zonas');
    expect(navLinks[3].textContent).toContain('Evoluciones');
    expect(navLinks[4].textContent).toContain('Proyecto');
  });
});
