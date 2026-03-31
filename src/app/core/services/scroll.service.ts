import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private breadcrumbEl?: HTMLElement;

  constructor() {}

  public registerBreadcrumb(element: HTMLElement) {
    this.breadcrumbEl = element;
  }

  public scrollFromBreadcrumb() {
    requestAnimationFrame(() => {
      if (!this.breadcrumbEl) return;

      const height: number = this.breadcrumbEl.offsetHeight;

      window.scrollTo({
        top: height,
        behavior: 'smooth',
      });
    });
  }
}
