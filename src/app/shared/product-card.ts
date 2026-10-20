import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../core/cart.service';
import { DataService } from '../core/data.service';
import { I18nService } from '../core/i18n.service';
import { InrPipe } from '../core/inr.pipe';
import { Product } from '../core/models';
import { ToastService } from '../core/toast.service';
import { TranslatePipe } from '../core/translate.pipe';
import { Icon } from './icon';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, TranslatePipe, InrPipe, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  readonly product = input.required<Product>();

  private readonly cart = inject(CartService);
  private readonly toast = inject(ToastService);
  private readonly i18n = inject(I18nService);
  private readonly data = inject(DataService);

  readonly discount = computed(() => this.data.discountPercent(this.product()));
  readonly justAdded = signal(false);

  add(): void {
    const p = this.product();
    this.cart.add(p.id);
    this.toast.show(this.i18n.t('toast.added', { name: this.i18n.t(`p${p.id}.name`) }));
    this.justAdded.set(true);
    setTimeout(() => this.justAdded.set(false), 1400);
  }
}
