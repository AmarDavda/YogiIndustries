import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/cart.service';
import { ContactService } from '../../core/contact.service';
import { DataService } from '../../core/data.service';
import { InrPipe } from '../../core/inr.pipe';
import { ToastService } from '../../core/toast.service';
import { I18nService } from '../../core/i18n.service';
import { TranslatePipe } from '../../core/translate.pipe';
import { Icon } from '../../shared/icon';
import { PageHeader } from '../../shared/page-header';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, TranslatePipe, InrPipe, Icon, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  protected readonly cart = inject(CartService);
  protected readonly contact = inject(ContactService);
  private readonly toast = inject(ToastService);
  private readonly i18n = inject(I18nService);
  protected readonly firstCategory = inject(DataService).categories[0]?.id ?? '';

  protected remove(id: number): void {
    this.cart.remove(id);
    this.toast.show(this.i18n.t('toast.removed'));
  }
}
