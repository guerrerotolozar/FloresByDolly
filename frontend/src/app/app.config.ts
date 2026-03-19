import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // ⚠️ IMPORTANTE: Angular 21 crea proyectos SIN Zone.js por defecto (zoneless).
    // Sin Zone.js, las asignaciones de propiedades dentro de subscribe() NO actualizan la vista.
    // Ejemplo: this.products = data; → la vista NO se re-renderiza.
    // Síntoma: los datos se cargan (se ven en console.log) pero no aparecen en pantalla
    //          hasta que haces click en algo que dispare change detection manualmente.
    // Solución: instalar zone.js (npm install zone.js), importarlo en main.ts,
    //           y usar provideZoneChangeDetection() en vez de provideBrowserGlobalErrorListeners().
    // eventCoalescing agrupa eventos para mejor performance.
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    // NO usar provideHttpClient(withFetch()) — withFetch() usa Fetch API que
    // también bypasea Zone.js y causa el mismo problema de no actualizar la vista.
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
