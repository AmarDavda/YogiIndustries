import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { CartLine, Product } from './models';
import { DataService } from './data.service';

const STORAGE_KEY = 'yogi_cart_v1';
const MAX_QTY = 99;

export interface DetailedLine {
  product: Product;
  qty: number;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly data = inject(DataService);
  private readonly _lines = signal<CartLine[]>(this.load());

  readonly lines = computed<DetailedLine[]>(() =>
    this._lines()
      .map((l) => {
        const product = this.data.getProduct(l.id);
        return product ? { product, qty: l.qty, total: product.price * l.qty } : null;
      })
      .filter((l): l is DetailedLine => l !== null),
  );
  readonly count = computed(() => this.lines().reduce((sum, l) => sum + l.qty, 0));
  readonly total = computed(() => this.lines().reduce((sum, l) => sum + l.total, 0));

  constructor() {
    effect(() => {
      const json = JSON.stringify(this._lines());
      try {
        localStorage.setItem(STORAGE_KEY, json);
      } catch {
        /* storage may be blocked - cart then lives only in memory */
      }
    });
  }

  add(id: number, qty = 1): void {
    this._lines.update((lines) =>
      lines.some((l) => l.id === id)
        ? lines.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l))
        : [...lines, { id, qty: Math.min(MAX_QTY, qty) }],
    );
  }

  setQty(id: number, qty: number): void {
    if (qty < 1) {
      this.remove(id);
      return;
    }
    this._lines.update((lines) => lines.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)));
  }

  remove(id: number): void {
    this._lines.update((lines) => lines.filter((l) => l.id !== id));
  }

  clear(): void {
    this._lines.set([]);
  }

  private load(): CartLine[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        return parsed
          .filter((l) => l && Number.isInteger(l.id) && Number.isInteger(l.qty) && l.qty > 0)
          .map((l) => ({ id: l.id as number, qty: Math.min(MAX_QTY, l.qty as number) }));
      }
    } catch {
      /* ignore corrupt data */
    }
    return [];
  }
}
