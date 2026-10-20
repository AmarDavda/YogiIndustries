import { Pipe, PipeTransform, inject } from '@angular/core';
import { DataService } from './data.service';

/** 4500 -> ₹4,500  (currency symbol and number format come from data/site.json) */
@Pipe({ name: 'inr' })
export class InrPipe implements PipeTransform {
  private readonly data = inject(DataService);

  transform(value: number | null | undefined): string {
    return formatMoney(this.data, value ?? 0);
  }
}

export function formatMoney(data: DataService, value: number): string {
  const { symbol, locale } = data.site.currency;
  return symbol + new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);
}
