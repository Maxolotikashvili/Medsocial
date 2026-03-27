import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  NgZone,
  OnDestroy,
  output,
  Output,
} from '@angular/core';

@Directive({
  selector: '[scrollToBottom]',
})
export class ScrollToBottom implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private ngZone = inject(NgZone);

  public bottomReached = output<void>();

  private ticking = false;
  private wasAtBottom = false;

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.el.nativeElement.addEventListener('scroll', this.onScroll, {
        passive: true,
      });
    });
  }

  ngOnDestroy(): void {
    this.el.nativeElement.removeEventListener('scroll', this.onScroll);
  }

  private onScroll = () => {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        const el = this.el.nativeElement;

        const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 1;

        if (atBottom && !this.wasAtBottom) {
          this.wasAtBottom = true;

          this.ngZone.run(() => {
            this.bottomReached.emit();
          });
        }

        if (!atBottom) {
          this.wasAtBottom = false;
        }

        this.ticking = false;
      });

      this.ticking = true;
    }
  };
  constructor() {}
}
