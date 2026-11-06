import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from '../app.routes';

export const routeProviders = [
  provideRouter(routes, withComponentInputBinding()),
];
