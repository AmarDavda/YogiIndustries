import { Injectable, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { DataService } from './data.service';
import { I18nService } from './i18n.service';

/** Keeps the browser tab title in sync with the current page and language. */
@Injectable({ providedIn: 'root' })
export class TitleService {
  private readonly router = inject(Router);
  private readonly data = inject(DataService);
  private readonly i18n = inject(I18nService);
  private readonly page = signal<{ key: string | null; id: string }>({ key: null, id: '' });

  constructor() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      let route = this.router.routerState.snapshot.root;
      while (route.firstChild) route = route.firstChild;
      this.page.set({ key: (route.data['titleKey'] as string) ?? null, id: route.params['id'] ?? '' });
    });
    effect(() => {
      const { key, id } = this.page();
      const name = this.data.site.name;
      document.title = key ? `${this.i18n.t(key.replace('{id}', id))} | ${name}` : `${name} | ${this.i18n.t('brand.tagline')}`;
    });
  }
}
