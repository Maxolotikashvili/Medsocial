import { Directive, ElementRef, inject, input, signal, OnInit, OnDestroy, InputSignal, WritableSignal } from '@angular/core';

@Directive({
  selector: '[animateOnScroll]',
  standalone: true,
  host: {
    'class': 'animation-scroll',
    '[class.visible]': 'isVisible()',
    '[style.transition-delay]': 'delay() + "ms"'
  }
})
export class AnimateOnScrollDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private observer: IntersectionObserver | null = null;
  
  public threshold: InputSignal<number> = input<number>(0.1);
  public delay: InputSignal<number> = input<number>(0);
  
  public isVisible: WritableSignal<boolean> = signal(false);
  

  ngOnInit() {
    this.createObserver();
  }

  private createObserver() {
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.isVisible.set(true);
        this.observer?.unobserve(this.el.nativeElement);
        this.observer?.disconnect(); 
      }
    }, { 
      threshold: this.threshold() 
    });

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}