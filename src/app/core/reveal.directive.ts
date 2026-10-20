import { AfterViewInit, Directive, ElementRef, OnDestroy, inject, input } from '@angular/core';

/** Fades an element in when it scrolls into view.  Usage: <div appReveal> or <div [appReveal]="120"> (delay in ms) */
@Directive({ selector: '[appReveal]' })
export class RevealDirective implements AfterViewInit, OnDestroy {
  readonly delay = input<number | string>(0, { alias: 'appReveal' });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    const el = this.host.nativeElement;
    el.classList.add('reveal');
    el.style.setProperty('--reveal-delay', `${Number(this.delay()) || 0}ms`);

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('in');
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('in');
            this.observer?.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
