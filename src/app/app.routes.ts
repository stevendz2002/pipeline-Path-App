import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { PokemonListComponent } from './pages/pokemon-list.component';
import { ZoneListComponent } from './pages/zone-list.component';
import { EvolutionListComponent } from './pages/evolution-list.component';
import { AboutComponent } from './pages/about.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Inicio | Pokédex' },
  { path: 'pokemon', component: PokemonListComponent, title: 'Pokémon | Pokédex' },
  { path: 'zonas', component: ZoneListComponent, title: 'Zonas | Pokédex' },
  { path: 'evolutions', component: EvolutionListComponent, title: 'Evoluciones | Pokédex' },
  { path: 'evolution', redirectTo: 'evolutions' },
  { path: 'about', component: AboutComponent, title: 'Proyecto | Pokédex' },
  { path: '**', redirectTo: '' },
];

