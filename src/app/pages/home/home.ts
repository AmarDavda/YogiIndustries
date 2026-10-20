import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContactService } from '../../core/contact.service';
import { DataService } from '../../core/data.service';
import { InrPipe } from '../../core/inr.pipe';
import { TranslatePipe } from '../../core/translate.pipe';
import { RevealDirective } from '../../core/reveal.directive';
import { Icon } from '../../shared/icon';

@Component({
  selector: 'app-home',
  imports: [RouterLink, TranslatePipe, InrPipe, Icon, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly data = inject(DataService);
  protected readonly site = this.data.site;
  protected readonly contact = inject(ContactService);

  /** products flagged "hero": true in catalog.json (falls back to the first 3 products) */
  protected readonly slides = (() => {
    const flagged = this.data.products.filter((p) => p.hero);
    return flagged.length ? flagged : this.data.products.slice(0, 3);
  })();
  protected readonly counts = this.data.categories.map((c) => this.data.productsOf(c.id).length);
  protected readonly years = new Date().getFullYear() - this.site.since;

  protected readonly index = signal(0);
  protected readonly last = computed(() => this.slides.length - 1);

  private paused = false;
  private startX = 0;
  private timer?: ReturnType<typeof setInterval>;

  constructor() {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!reduce && this.slides.length > 1) {
      this.timer = setInterval(() => {
        if (!this.paused && !document.hidden) this.next();
      }, this.site.heroIntervalMs);
    }
    inject(DestroyRef).onDestroy(() => clearInterval(this.timer));
  }

  next(): void {
    this.index.update((i) => (i >= this.last() ? 0 : i + 1));
  }
  prev(): void {
    this.index.update((i) => (i <= 0 ? this.last() : i - 1));
  }
  go(i: number): void {
    this.index.set(i);
  }
  pause(): void {
    this.paused = true;
  }
  resume(): void {
    this.paused = false;
  }

  onTouchStart(e: TouchEvent): void {
    this.startX = e.changedTouches[0].clientX;
    this.pause();
  }
  onTouchEnd(e: TouchEvent): void {
    const dx = e.changedTouches[0].clientX - this.startX;
    if (Math.abs(dx) > 45) (dx < 0 ? this.next() : this.prev());
    this.resume();
  }

  protected discount(id: number): number {
    const p = this.data.getProduct(id);
    return p ? this.data.discountPercent(p) : 0;
  }
}
