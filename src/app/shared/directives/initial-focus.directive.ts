import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[initialFocus]',
  standalone: true
})
export class InitialFocusDirective implements AfterViewInit {
  private el = inject(ElementRef);

  constructor() { }

  ngAfterViewInit(): void {
    this.focusOnInit();
  }
  
  private focusOnInit() {
    const input = this.el.nativeElement.querySelector('input');
    input?.focus();
  }
}
