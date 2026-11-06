import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { routeProviders } from './providers/route.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    ...routeProviders,
  ],
};
