import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { CartService } from '../../core/cart.service';
import { ContactService } from '../../core/contact.service';
import { DataService } from '../../core/data.service';
import { I18nService } from '../../core/i18n.service';
import { TranslatePipe } from '../../core/translate.pipe';
import { Icon } from '../icon';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly site = inject(DataService).site;
  protected readonly i18n = inject(I18nService);
  protected readonly cart = inject(CartService);
  protected readonly contact = inject(ContactService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly menuOpen = signal(false);
  protected readonly langOpen = signal(false);
  protected readonly scrolled = signal(false);

  constructor() {
    inject(Router)
      .events.pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.menuOpen.set(false);
        this.langOpen.set(false);
      });
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
    this.langOpen.set(false);
  }

  toggleLang(event: Event): void {
    event.stopPropagation();
    this.langOpen.update((v) => !v);
  }

  pickLanguage(code: string): void {
    void this.i18n.set(code);
    this.langOpen.set(false);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 8);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    if (this.langOpen() && !this.host.nativeElement.contains(event.target as Node)) this.langOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.langOpen.set(false);
    this.menuOpen.set(false);
  }
}
