import { Injectable, inject } from '@angular/core';
import { DataService } from './data.service';
import { I18nService } from './i18n.service';
import { formatMoney } from './inr.pipe';
import { DetailedLine } from './cart.service';
import { Product } from './models';

type Params = Record<string, string | number>;

/**
 * Builds WhatsApp / e-mail links with predefined messages.
 * The message wording lives in data/site.json ("messages" and "contactQuick") and is always English so the
 * business team can read it; product names come from data/i18n/en.json.
 */
@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly data = inject(DataService);
  private readonly i18n = inject(I18nService);

  get site() {
    return this.data.site;
  }

  private fill(template: string, params: Params = {}): string {
    return this.i18n.format(template, { company: this.site.name, ...params });
  }

  whatsappUrl(message: string): string {
    return `https://wa.me/${this.site.whatsapp}?text=${encodeURIComponent(message)}`;
  }

  mailtoUrl(subject: string, body: string): string {
    return `mailto:${this.site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  /** Link to a product page (works with hash routing in any hosting folder). */
  productLink(p: Product): string {
    return `${window.location.href.split('#')[0]}#/product/${p.id}`;
  }

  englishName(p: Product): string {
    return this.i18n.en(`p${p.id}.name`);
  }

  // ----- general / quick messages -----
  generalMessage(): string {
    return this.fill(this.site.messages.general);
  }
  generalWhatsappUrl(): string {
    return this.whatsappUrl(this.generalMessage());
  }
  quickMessage(template: string): string {
    return this.fill(template);
  }

  // ----- single product -----
  productOrderMessage(p: Product, qty: number): string {
    return this.fill(this.site.messages.productOrder, {
      name: this.englishName(p),
      price: formatMoney(this.data, p.price),
      qty,
      link: this.productLink(p),
    });
  }
  productOrderUrl(p: Product, qty = 1): string {
    return this.whatsappUrl(this.productOrderMessage(p, qty));
  }

  // ----- cart -----
  cartMessage(lines: DetailedLine[], total: number): string {
    const items = lines
      .map((l, i) =>
        this.fill(this.site.messages.cartLine, {
          i: i + 1,
          name: this.englishName(l.product),
          qty: l.qty,
          price: formatMoney(this.data, l.product.price),
          total: formatMoney(this.data, l.total),
        }),
      )
      .join('\n');
    return this.fill(this.site.messages.cartOrder, { items, total: formatMoney(this.data, total) });
  }
  cartWhatsappUrl(lines: DetailedLine[], total: number): string {
    return this.whatsappUrl(this.cartMessage(lines, total));
  }
  cartMailUrl(lines: DetailedLine[], total: number): string {
    return this.mailtoUrl(this.fill(this.site.messages.cartMailSubject), this.cartMessage(lines, total));
  }

  // ----- contact form -----
  formMessage(f: { name: string; phone: string; email: string; product: string; message: string }): string {
    return this.fill(this.site.messages.contactForm, {
      name: f.name,
      phone: f.phone,
      email: f.email || '-',
      product: f.product || this.site.messages.generalProduct,
      message: f.message,
    });
  }
  formMailUrl(f: { name: string; phone: string; email: string; product: string; message: string }): string {
    return this.mailtoUrl(this.fill(this.site.messages.contactMailSubject, { name: f.name }), this.formMessage(f));
  }
  formWhatsappUrl(f: { name: string; phone: string; email: string; product: string; message: string }): string {
    return this.whatsappUrl(this.formMessage(f));
  }
}
