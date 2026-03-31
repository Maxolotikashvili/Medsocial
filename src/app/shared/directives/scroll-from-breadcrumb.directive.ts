import { AfterViewInit, Directive, inject } from '@angular/core';
import { ScrollService } from '../../core/services/scroll.service';

@Directive({
  selector: '[scrollFromBreadcrumbDirective]',
})
export class ScrollFromBreadcrumbDirective implements AfterViewInit {
  private scrollService = inject(ScrollService);
  constructor() {}

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      this.scrollService.scrollFromBreadcrumb();
    });
  }

  
}
