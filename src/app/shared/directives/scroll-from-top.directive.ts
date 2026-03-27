import { Directive, inject, NgZone, OnDestroy, OnInit, output, signal, WritableSignal } from '@angular/core';

@Directive({
  selector: '[scrollFromTop]',
})
export class ScrollFromTop implements OnInit, OnDestroy {
  private ngZone = inject(NgZone);

  public isScrolledState = output<boolean>();

  private ticking: boolean = false;
  private isScrolled: WritableSignal<boolean> = signal<boolean>(false);

  constructor() {}

  ngOnInit(): void {
    this.attachScrollEvent();
  }

  private attachScrollEvent() {
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
    });
  }

  private onScroll = () => {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY > 10;

        if (scrolled !== this.isScrolled()) {
          this.ngZone.run(() => {
            this.isScrolled.set(scrolled);
            this.isScrolledState.emit(this.isScrolled());
          });
        }

        this.ticking = false;
      });

      this.ticking = true;
    }
  };

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
  }
}
