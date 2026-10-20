import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DataService } from '../../core/data.service';
import { RevealDirective } from '../../core/reveal.directive';
import { TranslatePipe } from '../../core/translate.pipe';
import { Icon } from '../../shared/icon';
import { PageHeader } from '../../shared/page-header';

@Component({
  selector: 'app-policy',
  imports: [TranslatePipe, Icon, PageHeader, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './policy.html',
  styleUrl: './policy.css',
})
export class Policy {
  /** sections come from data/site.json ("policySections"); texts are pol.h<n> / pol.t<n> in data/i18n/<lang>.json */
  protected readonly sections = inject(DataService).site.policySections;
}
