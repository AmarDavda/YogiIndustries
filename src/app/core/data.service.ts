import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CatalogFile, Category, Product, SiteConfig } from './models';

const NO_CACHE = { headers: { 'Cache-Control': 'no-cache' } };

/**
 * Loads all website data from JSON files in /public/data before the app starts:
 *   data/site.json     company details, navigation, messages, settings
 *   data/catalog.json  categories and products (prices, images, specs)
 *   data/i18n/<lang>.json   every text on the website, one file per language
 */
@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly http = inject(HttpClient);

  /** filled by load() - the app only renders after load() has finished */
  site!: SiteConfig;
  categories: Category[] = [];
  products: Product[] = [];

  async load(): Promise<void> {
    const [site, catalog] = await Promise.all([
      firstValueFrom(this.http.get<SiteConfig>('data/site.json', NO_CACHE)),
      firstValueFrom(this.http.get<CatalogFile>('data/catalog.json', NO_CACHE)),
    ]);
    this.site = site;
    this.categories = catalog.categories;
    this.products = catalog.products;
  }

  getProduct(id: number | string | undefined): Product | undefined {
    return this.products.find((p) => p.id === Number(id));
  }

  getCategory(id: string | undefined): Category | undefined {
    return this.categories.find((c) => c.id === id);
  }

  productsOf(categoryId: string): Product[] {
    return this.products.filter((p) => p.category === categoryId);
  }

  discountPercent(p: Product): number {
    return p.mrp && p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
  }
}
