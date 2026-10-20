import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/cart.service';
import { ContactService } from '../../core/contact.service';
import { DataService } from '../../core/data.service';
import { I18nService } from '../../core/i18n.service';
import { InrPipe } from '../../core/inr.pipe';
import { ToastService } from '../../core/toast.service';
import { TranslatePipe } from '../../core/translate.pipe';
import { Icon } from '../../shared/icon';
import { PageHeader } from '../../shared/page-header';
import { ProductCard } from '../../shared/product-card';

@Component({
  selector: 'app-product',
  imports: [RouterLink, TranslatePipe, InrPipe, Icon, PageHeader, ProductCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class ProductPage {
  /** bound from the route :id */
  readonly id = input<string>();

  private readonly data = inject(DataService);
  private readonly cart = inject(CartService);
  private readonly toast = inject(ToastService);
  private readonly i18n = inject(I18nService);
  protected readonly contact = inject(ContactService);
  protected readonly site = this.data.site;

  protected readonly product = computed(() => this.data.getProduct(this.id()));
  protected readonly discount = computed(() => {
    const p = this.product();
    return p ? this.data.discountPercent(p) : 0;
  });
  protected readonly related = computed(() => {
    const p = this.product();
    if (!p) return [];
    const same = this.data.products.filter((x) => x.id !== p.id && x.category === p.category);
    const rest = this.data.products.filter((x) => x.id !== p.id && x.category !== p.category);
    return [...same, ...rest].slice(0, 4);
  });

  protected readonly selected = signal(0);
  protected readonly qty = signal(1);
  protected readonly zoom = signal<{ x: number; y: number } | null>(null);
  protected readonly justAdded = signal(false);

  constructor() {
    // reset gallery + quantity when another product is opened
    effect(() => {
      this.product();
      this.selected.set(0);
      this.qty.set(1);
    });
  }

  protected changeQty(delta: number): void {
    this.qty.update((q) => Math.min(99, Math.max(1, q + delta)));
  }

  protected add(): void {
    const p = this.product();
    if (!p) return;
    this.cart.add(p.id, this.qty());
    this.toast.show(this.i18n.t('toast.added', { name: this.i18n.t(`p${p.id}.name`) }));
    this.justAdded.set(true);
    setTimeout(() => this.justAdded.set(false), 1400);
  }

  protected onMove(event: MouseEvent): void {
    const box = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.zoom.set({
      x: ((event.clientX - box.left) / box.width) * 100,
      y: ((event.clientY - box.top) / box.height) * 100,
    });
  }
}
