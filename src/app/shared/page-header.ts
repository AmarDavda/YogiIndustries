import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../core/translate.pipe';
import { Icon } from './icon';

export interface Crumb {
  label: string;
  link?: string;
}

@Component({
  selector: 'app-page-header',
  imports: [RouterLink, TranslatePipe, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="ph">
      <div class="container">
        <nav class="crumbs" aria-label="Breadcrumb">
          <a routerLink="/">{{ 'crumb.home' | t }}</a>
          @for (c of crumbs(); track c.label) {
            <app-icon name="right" />
            @if (c.link) { <a [routerLink]="c.link">{{ c.label }}</a> } @else { <span aria-current="page">{{ c.label }}</span> }
          }
        </nav>
        <h1>{{ title() }}</h1>
        @if (subtitle()) { <p>{{ subtitle() }}</p> }
      </div>
    </section>
  `,
  styles: `
    .ph { position: relative; overflow: hidden; color: #fff; padding: 44px 0 48px;
      background: radial-gradient(900px 300px at 85% -20%, rgba(242,106,27,.55), transparent 60%), linear-gradient(135deg, #2a1409, #5d2208); }
    .ph::after { content: ''; position: absolute; right: -60px; bottom: -90px; width: 280px; height: 280px; border-radius: 50%;
      border: 40px solid rgba(247,179,43,.12); }
    .container { position: relative; z-index: 1; }
    .crumbs { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: .88rem; color: rgba(255,255,255,.75); margin-bottom: 14px; }
    .crumbs a:hover { color: #fff; text-decoration: underline; }
    .crumbs app-icon { width: 1em; height: 1em; opacity: .6; }
    .crumbs span { color: #fff; font-weight: 600; }
    h1 { font-size: clamp(1.7rem, 4.2vw, 2.6rem); max-width: 22ch; }
    p { margin-top: 10px; max-width: 60ch; color: rgba(255,255,255,.82); font-size: 1.05rem; }
    @media (max-width: 480px) { .ph { padding: 28px 0 32px; } p { font-size: .98rem; } }
  `,
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly crumbs = input<Crumb[]>([]);
}
