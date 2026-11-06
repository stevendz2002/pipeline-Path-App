import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { PokemonListComponent } from './pages/pokemon-list.component';
import { AboutComponent } from './pages/about.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Inicio | Pokédex' },
  { path: 'pokemon', component: PokemonListComponent, title: 'Pokémon | Pokédex' },
  { path: 'about', component: AboutComponent, title: 'Proyecto | Pokédex' },
  { path: '**', redirectTo: '' },
];
