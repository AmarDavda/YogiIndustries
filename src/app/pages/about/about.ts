import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContactService } from '../../core/contact.service';
import { DataService } from '../../core/data.service';
import { RevealDirective } from '../../core/reveal.directive';
import { TranslatePipe } from '../../core/translate.pipe';
import { I18nService } from '../../core/i18n.service';
import { Icon } from '../../shared/icon';
import { PageHeader } from '../../shared/page-header';

@Component({
  selector: 'app-about',
  imports: [RouterLink, TranslatePipe, Icon, RevealDirective, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  private readonly data = inject(DataService);
  protected readonly site = this.data.site;
  protected readonly firstCategory = this.data.categories[0]?.id ?? '';
  protected readonly contact = inject(ContactService);
  protected readonly i18n = inject(I18nService);
  protected readonly years = new Date().getFullYear() - this.site.since;
}
