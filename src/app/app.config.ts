import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import Lara from '@primeuix/themes/lara';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';

registerLocaleData(localePl);

import { routes } from './app.routes';

const OlimpijczykTheme = definePreset(Lara, {
  semantic: {
    primary: {
      50:  '#fff8ec',
      100: '#ffefc9',
      200: '#ffdf94',
      300: '#ffc85e',
      400: '#ffb02e',
      500: '#F5A623',
      600: '#C8891A',
      700: '#9a6713',
      800: '#6e490d',
      900: '#422b07',
      950: '#1a1002',
    },
    colorScheme: {
      dark: {
        surface: {
          0:   '#ffffff',
          50:  '#f5f5f5',
          100: '#1e1e1e',
          200: '#2a2a2a',
          300: '#333333',
          400: '#444444',
          500: '#666666',
          600: '#888888',
          700: '#aaaaaa',
          800: '#cccccc',
          900: '#eeeeee',
          950: '#f8f8f8',
        },
        primary: { color: '#F5A623', contrastColor: '#000000', hoverColor: '#C8891A', activeColor: '#9a6713' }
      }
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: LOCALE_ID, useValue: 'pl' },
    provideHttpClient(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: { preset: OlimpijczykTheme, options: { darkModeSelector: 'body', cssLayer: false } }
    })
  ]
};
