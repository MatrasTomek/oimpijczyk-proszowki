import { Directive, ElementRef, Input, OnInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  @Input() revealDir: 'up' | 'left' | 'right' = 'up';
  @Input() revealDelay = 0;

  private el = inject(ElementRef<HTMLElement>);
  private platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const el: HTMLElement = this.el.nativeElement;
    const cls = this.revealDir === 'up' ? 'reveal' : `reveal-${this.revealDir}`;
    el.classList.add(cls);
    if (this.revealDelay) el.style.transitionDelay = `${this.revealDelay}ms`;

    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            this.observer?.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    this.observer.observe(el);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
