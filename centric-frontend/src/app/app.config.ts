import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Eliminamos provideZoneChangeDetection y activamos el modo Zoneless
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch())
  ]
};