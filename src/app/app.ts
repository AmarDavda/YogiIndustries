import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContactService } from './core/contact.service';
import { TitleService } from './core/title.service';
import { TranslatePipe } from './core/translate.pipe';
import { Footer } from './shared/footer/footer';
import { Icon } from './shared/icon';
import { Navbar } from './shared/navbar/navbar';
import { Toast } from './shared/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Toast, Icon, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-navbar />
    <main id="main"><router-outlet /></main>
    <app-footer />

    <a class="wa-float" [href]="contact.generalWhatsappUrl()" target="_blank" rel="noopener" [attr.aria-label]="'wa.float' | t">
      <app-icon name="whatsapp" />
    </a>
    <button type="button" class="to-top" [class.show]="showTop()" (click)="toTop()" [attr.aria-label]="'foot.top' | t">
      <app-icon name="up" />
    </button>
    <app-toast />
  `,
  styles: `
    .wa-float { position: fixed; right: 18px; bottom: 18px; z-index: 300; width: 56px; height: 56px; border-radius: 50%;
      display: grid; place-items: center; background: var(--wa); color: #fff; font-size: 1.9rem; box-shadow: 0 10px 26px rgba(31,168,85,.45);
      transition: transform .2s ease; animation: pulse 2.4s infinite; }
    .wa-float:hover { transform: scale(1.08); }
    .wa-float app-icon { width: 30px; height: 30px; }
    .to-top { position: fixed; right: 24px; bottom: 90px; z-index: 290; width: 42px; height: 42px; border-radius: 50%; border: 1px solid var(--line);
      background: var(--surface); color: var(--primary-strong); display: grid; place-items: center; box-shadow: var(--shadow);
      opacity: 0; transform: translateY(10px); pointer-events: none; transition: opacity .25s, transform .25s; }
    .to-top.show { opacity: 1; transform: none; pointer-events: auto; }
    @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(31,168,85,.5), 0 10px 26px rgba(31,168,85,.35); } 70% { box-shadow: 0 0 0 16px rgba(31,168,85,0), 0 10px 26px rgba(31,168,85,.35); } 100% { box-shadow: 0 0 0 0 rgba(31,168,85,0), 0 10px 26px rgba(31,168,85,.35); } }
    @media (max-width: 480px) { .wa-float { right: 14px; bottom: 14px; width: 52px; height: 52px; } .to-top { right: 19px; bottom: 76px; width: 38px; height: 38px; } }
  `,
})
export class App {
  protected readonly contact = inject(ContactService);
  protected readonly showTop = signal(false);

  constructor() {
    inject(TitleService); // starts keeping the tab title in sync
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.showTop.set(window.scrollY > 600);
  }

  toTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
