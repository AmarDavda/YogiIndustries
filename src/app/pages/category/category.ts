import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/data.service';
import { Product } from '../../core/models';
import { RevealDirective } from '../../core/reveal.directive';
import { TranslatePipe } from '../../core/translate.pipe';
import { PageHeader } from '../../shared/page-header';
import { ProductCard } from '../../shared/product-card';
import { Icon } from '../../shared/icon';

type SortMode = 'def' | 'low' | 'high';

@Component({
  selector: 'app-category',
  imports: [RouterLink, TranslatePipe, PageHeader, ProductCard, RevealDirective, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category {
  /** bound from the route :id */
  readonly id = input<string>();

  private readonly data = inject(DataService);
  protected readonly sort = signal<SortMode>('def');
  protected readonly others = computed(() => this.data.categories.filter((c) => c.id !== this.id()));
  protected readonly category = computed(() => this.data.getCategory(this.id()));

  protected readonly products = computed<Product[]>(() => {
    const list = [...this.data.productsOf(this.id() ?? '')];
    if (this.sort() === 'low') list.sort((a, b) => a.price - b.price);
    if (this.sort() === 'high') list.sort((a, b) => b.price - a.price);
    return list;
  });

  protected onSort(event: Event): void {
    this.sort.set((event.target as HTMLSelectElement).value as SortMode);
  }
}
