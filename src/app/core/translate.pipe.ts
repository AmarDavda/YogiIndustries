import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from './i18n.service';

/** Usage: {{ 'nav.home' | t }}   or   {{ 'list.count' | t: { n: 5 } }} */
@Pipe({ name: 't', pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(key: string, params?: Record<string, string | number>): string {
    this.i18n.lang(); // keeps the pipe in sync with the language signal
    return this.i18n.t(key, params);
  }
}
