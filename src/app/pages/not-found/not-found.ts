import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../core/translate.pipe';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container nf">
        <span class="nf__code">404</span>
        <h1>{{ 'nf.title' | t }}</h1>
        <p>{{ 'nf.text' | t }}</p>
        <a routerLink="/" class="btn btn--primary btn--lg">{{ 'nf.home' | t }}</a>
      </div>
    </section>
  `,
  styles: `
    .nf { text-align: center; display: grid; gap: 14px; justify-items: center; padding: 48px 0; }
    .nf__code { font-family: var(--font-head); font-weight: 800; font-size: clamp(5rem, 22vw, 9rem); line-height: 1;
      background: linear-gradient(135deg, var(--primary), var(--gold)); -webkit-background-clip: text; background-clip: text; color: transparent; }
    p { color: var(--muted); }
  `,
})
export class NotFound {}
