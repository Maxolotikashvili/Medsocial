import { AfterViewInit, Directive, ElementRef, NgZone, inject } from '@angular/core';

@Directive({
  selector: '[initialFocus]',
  standalone: true,
})
export class InitialFocusDirective implements AfterViewInit {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private zone = inject(NgZone);

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        requestAnimationFrame(() => {
          this.focusElement();
        });
      }, 300);
    });
  }

  private focusElement(): void {
    const host = this.el.nativeElement;

    const target =
      host instanceof HTMLInputElement ||
      host instanceof HTMLTextAreaElement
        ? host
        : host.querySelector<HTMLElement>(
            'input, textarea, select, button, [tabindex]:not([tabindex="-1"])'
          );

    target?.focus({ preventScroll: true });
  }
}