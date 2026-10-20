import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import {
  provideRouter,
  withComponentInputBinding,
  withHashLocation,
  withInMemoryScrolling,
} from '@angular/router';
import { routes } from './app.routes';
import { DataService } from './core/data.service';
import { I18nService } from './core/i18n.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    // Hash routing = works on any static host (no server rewrite rules needed).
    provideRouter(
      routes,
      withHashLocation(),
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),
    // Load every piece of website data (JSON files in /public/data) before the app is shown.
    provideAppInitializer(async () => {
      const data = inject(DataService);
      const i18n = inject(I18nService);
      await data.load();
      await i18n.init();
    }),
  ],
};
