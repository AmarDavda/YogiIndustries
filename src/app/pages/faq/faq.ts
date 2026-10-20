import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContactService } from '../../core/contact.service';
import { DataService } from '../../core/data.service';
import { TranslatePipe } from '../../core/translate.pipe';
import { Icon } from '../../shared/icon';
import { PageHeader } from '../../shared/page-header';

@Component({
  selector: 'app-faq',
  imports: [RouterLink, TranslatePipe, Icon, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class Faq {
  protected readonly contact = inject(ContactService);
  private readonly count = inject(DataService).site.faqCount;
  /** question numbers 1..faqCount - texts are faq.q<n> / faq.a<n> in data/i18n/<lang>.json */
  protected readonly items = computed(() => Array.from({ length: this.count }, (_, i) => i + 1));
  protected readonly open = signal<number>(1);

  protected toggle(n: number): void {
    this.open.update((cur) => (cur === n ? 0 : n));
  }
}
